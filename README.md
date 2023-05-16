categoryApi
PREFIX = "categories";
getCategoryList(), GET, ${PREFIX}
comboApi (chức năng phụ)
PREFIX = "combos";
create(data),  POST, ${PREFIX}/create
search(name), GET, ${PREFIX}/search
getComboById(id), GET, ${PREFIX}/${id}
getListOfCombo(), GET, ${PREFIX}
delete(id), DELETE, ${PREFIX}/${id}
update(id, data), PATCH, ${PREFIX}/${id}
customerApi
PREFIX = "customers"
create(data), POST, ${PREFIX}/create
searchByNameOrRank({ name, rank }), GET, ${PREFIX}/search
getCustomerById(id), GET, ${PREFIX}/${id}
deleteCustomerById(id), DELETE, ${PREFIX}/${id}
updateCustomerById(id, data), PATCH, ${PREFIX}/${id}
membership_LevelApi
PREFIX = "discounts"
create(data), POST, ${PREFIX}/create
getdiscountById(id), GET, ${PREFIX}/${id}
delete(id), DELETE, ${PREFIX}/${id}
update(id, data), PATCH, ${PREFIX}/${id}
dishApi
PREFIX = "dishes"
create(data), POST, ${PREFIX}/create
search(name), GET, ${PREFIX}/search/
getDiskById(id), GET,  ${PREFIX}/${id}
getListOfDish(), GET,  ${PREFIX}
delete(id), DELETE,  ${PREFIX}/${id}
update(id, data), PATCH, ${PREFIX}/${id}
employeeApi
PREFIX = "employees"
login(data), POST, ${PREFIX}/login
getEmployeeById(id), GET, ${PREFIX}/${id}
eventApi
PREFIX = "events"
delete(id), delete, `${PREFIX}/${id}’
update(id, data), patch, `${PREFIX}/${id}`
create(data), POST, ${PREFIX}/create
getEventById(id), GET, ${PREFIX}/${id}
searchEvent(name)), GET, ${PREFIX}/search
orderApi
PREFIX = "orders"
create(data) (post), url = `${PREFIX}/create`
delete(id) (delete), url = `${PREFIX}/${id}`
update(id, data) (patch), url = `${PREFIX}/${id}`
updateCost(id, data) (patch), url = `${PREFIX}/cost/${id}  ????
getOrderById(id) (get), url = `${PREFIX}/${id}`
search(name, date) (get), url = `${PREFIX}/search`
getComboAndDisk(id) (get),  url = `${PREFIX}/combo-and-disk/${id}`
getStatistic(data)(get), url = `${PREFIX}/statistic`
getOrdersBetweenDate(data) (get), url = `${PREFIX}/orderBetweenDate`
tableApi
PREFIX = "tables"
createTable: (data) (pos), url = `${PREFIX}/create`
updateTable: (id, data) (patch), url = `${PREFIX}/${id}`
getTableById: (id) (get), url = `${PREFIX}/${id}`
getTableList: () (get), url = `${PREFIX}`
deleteTableById: (id) (delete),  url = `${PREFIX}/${id}`
