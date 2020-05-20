#!/usr/bin/env bash


export declare -a nodes=(172.26.130.162 172.26.130.251 172.26.132.37)
export master_node=172.26.130.162
export declare -a other_node=(172.26.130.251 172.26.132.37)
export size=${#nodes[@]}
export user=admin
export pass=password

echo "==set_enable_cluster=="
for node in ${nodes}
do 
curl -X POST "http://${user}:${pass}@${node}:5984/_cluster_setup" -H 'Content-Type: application/json' \
    -d "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\", \"username\": \"${user}\", \"password\":\"${pass}\", \"node_count\":\"${size}\"}"
done

echo "==set_enable_cluster_for_slaves=="
for node in ${other_nodes} 
do
    curl -XPOST "http://${user}:${pass}@${master_node}:5984/_cluster_setup" \
      --header "Content-Type: application/json"\
      --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\
             \"username\": \"${user}\", \"password\":\"${pass}\", \"port\": \"5984\",\
             \"remote_node\": \"${node}\", \"node_count\": \"$(echo ${nodes[@]} | wc -w)\",\
             \"remote_current_user\":\"${user}\", \"remote_current_password\":\"${pass}\"}"
done

echo "==add node=="
for node in ${other_nodes}
do
    curl -XPOST "http://${user}:${pass}@${master_node}:5984/_cluster_setup"\
      --header "Content-Type: application/json"\
      --data "{\"action\": \"add_node\", \"host\":\"${node}\",\
             \"port\": \"5984\", \"username\": \"${user}\", \"password\":\"${pass}\"}"
done

echo "==avoid error=="
curl -XGET "http://${user}:${pass}@${master_node}:5984/"

echo "==finish cluster=="
curl -XPOST "http://${user}:${pass}@${master_node}:5984/_cluster_setup"\
    --header "Content-Type: application/json" --data "{\"action\": \"finish_cluster\"}"
curl http://${user}:${pass}@${master_node}:5984/_cluster_setup

echo "==show membership=="
for node in "${nodes[@]}"; do  curl -X GET http://${user}:${pass}@${node}:5984/_membership; done

echo "==add test db=="
curl -XPUT "http://${user}:${pass}@${master node}:5984/twitter"
for node in "${nodes[@]}"; do  curl -X GET "http://${user}:${pass}@${node}:5984/_all_dbs"; done


# curl -XPOST "http://admin:password@172.26.130.162:5984/_cluster_setup" --header "Content-Type: application/json" --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\"username\": \"admin\", \"password\":\"password\", \"port\": \"5984\",\"remote_node\": \"172.26.130.251\", \"node_count\": \"3\",\"remote_current_user\":\"admin\", \"remote_current_password\":\"password\"}"
# curl -XPOST "http://admin:password@172.26.130.162:5984/_cluster_setup" --header "Content-Type: application/json" --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\"username\": \"admin\", \"password\":\"password\", \"port\": \"5984\",\"remote_node\": \"172.26.132.37\", \"node_count\": \"3\",\"remote_current_user\":\"admin\", \"remote_current_password\":\"password\"}"

# curl -XPOST "http://admin:password@172.26.130.162:5984/_cluster_setup" --header "Content-Type: application/json" --data "{\"action\": \"add_node\", \"host\":\"172.26.130.251\",\"port\": \"5984\", \"username\": \"admin\", \"password\":\"password\"}"
# curl -XPOST "http://admin:password@172.26.130.162:5984/_cluster_setup" --header "Content-Type: application/json" --data "{\"action\": \"add_node\", \"host\":\"172.26.132.37\",\"port\": \"5984\", \"username\": \"admin\", \"password\":\"password\"}"

# curl -X GET http://admin:password@172.26.130.162:5984/_membership