In this section various architectural examples are collected, which go into great detail. These should help to deploy the solution in different environments. 
Currently there is only the example, but the list should be extended as we go. Feel free to contribute.


## Classic-Deployment

Example architecture with classically deployed API gateways running for example on virtual machines.  
Filebeat runs in this architecture as a "normal" process on the API gateways. For this a Filebeat >7.9 should be used.  
All other components run as native docker container.  

<p align="center">
<img src="https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/imgs/architecture-examples/architecture-example-1-classic-deployment.png"
  alt="Classic Architecture"
  width="500">
</p>
