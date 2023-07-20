# Sample code for the article "Create an Azure-Ready GitHub Repository using Pulumi"

## What is it?

This repository contains the code used in this [blog article](https://www.techwatching.dev/posts/azure-ready-github-repository) that talks about provisioning a Github repository that has everything correctly configured to provision Azure resources or deploy applications to Azure from a GitHub Actions CI/CD pipeline.

This code is a Pulumi TypeScript program that can be executed from the Pulumi CLI. When you execute it, it will provision the following resources:
- a GitHub repository configured with several GitHub Actions secrets and an pre-configured GitHub Actions workflow
- an Active Directory app registration, its associated Service Principal and a Federated Identity Credential

![AzureOIDC](https://github.com/TechWatching/AzureOIDC/assets/15186176/f5847de6-345f-4443-8fae-6c989355f9cd)

I suggest you to read [the article](https://www.techwatching.dev/posts/azure-ready-github-repository) before using this code. And if you are not familiar with Pulumi you should check their [documentation](https://www.pulumi.com/docs/) or [learning pathways](https://www.pulumi.com/learn/) too.

## How to use it ?

### Prerequisites

You can check [Pulumi documentation](https://www.pulumi.com/docs/get-started/azure/begin/) to set up your environment.
You will have to install on your machine:
- Pulumi CLI
- Azure CLI
- pnpm
- Node.js (can be done using [pnpm](https://bordeauxcoders.com/manage-multiple-nodejs-versions))

You will need an Azure subscription and access to an Azure Active Directory.

You can use any [backend](https://www.pulumi.com/docs/intro/concepts/state/) for your Pulumi program (to store the state and encrypt secrets) but I suggest you to use the default backend: the Pulumi Cloud. It's free for individuals, you will just need to create an account on Pulumi website. If you prefer to use an Azure Blob Storage backend with an Azure Key Vault as the encryption provider you can check [this article](https://www.techwatching.dev/posts/pulumi-azure-backend).

Before executing the program you need to modify the configuration of the stack (contained in the `Pulumi.dev.yaml` file) to set the Pulumi and the GitHub tokens. You can do that by executing the following commands:

```pwsh
pulumi config set --secret pulumiTokenForRepository yourpulumicloudtoken
pulumi config set --secret github:token yougithubtoken
```

You should also modify the `ìndex.ts` to use the name you want for you ressources and the author that will be used to commit the workflow file on your new GitHub repository.

### Execute the Pulumi program

- clone this repository
- log on to your Azure account using Azure CLI
- log on to your Pulumi backend using Pulumi CLI
- install the dependencies using pnpm
- run this command `pulumi up`

