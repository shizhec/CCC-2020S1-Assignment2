# Run Ansible
## The Openstack Password
```
MDUzMTVjY2U4YTg0YmM3
```

## Instance IP address
```
Instance1: 172.26.130.162
Instance2: 172.26.130.251
Instance3: 172.26.132.37
Instance4: 172.26.132.136
```
### To login to each instance
1. copy the CCC-Nectar-Group.pem file to ~/.ssh/
2. type: ssh -i ~/.ssh/CCC-Nectar-Group.pem ubuntu@[instance_ip]

## Couchdb
The installed version is ibmcom/couchdb3:3.0.0 using docker-compose
username: admin
password: password

db can be manully access by typing http://[instance_ip]:5984/_utils in browser


