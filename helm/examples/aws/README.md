# Cheat Sheet EKS-Deployment

```
eksctl create cluster --name apim-eks --region eu-west-1 --with-oidc
```

```
eksctl create nodegroup --cluster apim-eks --region eu-west-1 -n ng-elastic --nodes 2 --ssh-access --ssh-public-key test-eks-ssh-key -t m5.2xlarge --managed
```

```
eksctl create nodegroup --cluster apim-eks --region eu-west-1 -n ng-apim --nodes 2 --ssh-access --ssh-public-key test-eks-ssh-key -t m5.xlarge --managed
```

https://docs.aws.amazon.com/de_de/eks/latest/userguide/aws-load-balancer-controller.html
```
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.2.0/docs/install/iam_policy.json
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json

eksctl create iamserviceaccount --cluster=apim-eks --namespace=kube-system --name=aws-load-balancer-controller --attach-policy-arn=arn:aws:iam::343943056565:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve 

kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"
helm repo add eks https://aws.github.io/eks-charts

helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller --set clusterName=apim-eks --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller -n kube-system
```

ingress: apim/axway-elk-apim4elastic-kibana: none certificate found for host: kibana.axway-apim-on-eks.de"

Create a certificate at AWS ACM: *.axway-apim-on-eks.de

External-DNS
Enable Route 53 Auto-Updates: 
https://github.com/kubernetes-sigs/external-dns

Create a Service-Account
eksctl create iamserviceaccount --name external-dns --namespace kube-system --cluster apim-eks --attach-policy-arn arn:aws:iam::343943056565:policy/Route53ExternalUpdates --approve


helm install -n apim -f elastic4apim-aws-deployment-values.yaml axway-elk https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v3.2.0/helm-chart-apim4elastic-v3.2.0.tgz