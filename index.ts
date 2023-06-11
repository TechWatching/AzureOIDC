import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";
import * as azuread from "@pulumi/azuread";
import * as authorization from "@pulumi/azure-native/authorization";
import { azureBuiltInRoles } from "./builtInRoles";
import { readFileSync } from "fs";

const config = new pulumi.Config();

const repository = new github.Repository("azure-ready-repository", {
  name: "azure-ready-repository",
  visibility: "public",
  autoInit: true
});

export const repositoryCloneUrl = repository.httpCloneUrl;

const aadApplication = new azuread.Application("AzureReadyApp", { displayName: "Azure Ready App" });
const servicePrincipal = new azuread.ServicePrincipal("AzureReadyServicePrincipal", {
  applicationId: aadApplication.applicationId,
});
new azuread.ApplicationFederatedIdentityCredential("AzureReadyAppFederatedIdentityCredential", {
  applicationObjectId: aadApplication.objectId,
  displayName: "AzureReadyDeploys",
  description: "Deployments for azure-ready-repository",
  audiences: ["api://AzureADTokenExchange"],
  issuer: "https://token.actions.githubusercontent.com",
  subject: pulumi.interpolate`repo:${repository.fullName}:ref:refs/heads/main`,
});

const azureConfig = pulumi.output(authorization.getClientConfig());
const subscriptionId = azureConfig.subscriptionId;

new authorization.RoleAssignment("contributor", {
  principalId: servicePrincipal.id,
  principalType: authorization.PrincipalType.ServicePrincipal,
  roleDefinitionId: azureBuiltInRoles.contributor,
  scope: pulumi.interpolate`/subscriptions/${subscriptionId}`,
});

new github.ActionsSecret("tenantId", {
  repository: repository.name,
  secretName: "ARM_TENANT_ID",
  plaintextValue: azureConfig.tenantId,
});

new github.ActionsSecret("subscriptionId", {
  repository: repository.name,
  secretName: "ARM_SUBSCRIPTION_ID",
  plaintextValue: azureConfig.subscriptionId,
});

new github.ActionsSecret("clientId", {
  repository: repository.name,
  secretName: "ARM_CLIENT_ID",
  plaintextValue: aadApplication.applicationId,
});

new github.ActionsSecret("pulumiAccessToken", {
  repository: repository.name,
  secretName: "PULUMI_ACCESS_TOKEN",
  plaintextValue: config.requireSecret("pulumiTokenForRepository"),
});

const pipelineContent = readFileSync("main.yml", "utf-8");
new github.RepositoryFile("pipelineRepositoryFile", {
  repository: repository.name,
  branch: "main",
  file: ".github/workflows/main.yml",
  content: pipelineContent,
  commitMessage: "Add preconfigured pipeline file",
  commitAuthor: "Alexandre Nédélec",
  commitEmail: "15186176+TechWatching@users.noreply.github.com",
  overwriteOnCreate: true,
});