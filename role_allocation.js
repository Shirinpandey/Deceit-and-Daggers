function allocateRoles(names) {
    let num = names.length 
    let role_list = []
    let already_assigned = 0
    role_list.push("medic");
    if (num <7) {
        role_list.push("killer");
        already_assigned = 2;
    } else {
        role_list.push("killer");
        role_list.push("killer");
        already_assigned = 3;
    }
    
    civillian_no = num-already_assigned;
    let assignedRoles = []
    
    for (let i = 0; i < (civillian_no); i++) {
        role_list.push("civillian");
    }
    for (let i = 0; i < (role_list.length); i++) {
        let random_index = Math.floor(Math.random()* role_list.length);
        assignedRoles.push(role_list[random_index]);
        role_list.splice(random_index, 1);
    }

    roles_name_list = [];
    
    for (let i = 0; i < (names.length); i++) {
        roles_name_list.push({name: names[i], role: assignedRoles[i]})
    }
    console.log(roles_name_list);
    return roles_name_list;
}

function main(){
    assignedRoles = allocateRoles(['maya', 'sally', 'jason', 'poppy', 'juju', 'sky'])
}

main();