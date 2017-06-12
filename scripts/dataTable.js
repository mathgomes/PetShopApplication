/* File: dataTable.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */


 function filterSearch(tableID, filterID) {

	var input, filter, table, tr, td, i;
	input = document.getElementById(filterID);
	filter = input.value.toUpperCase();
	table = document.getElementById(tableID);
	tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
	for (i = 1; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td");
		data = ""
		for(j = 1; j < td.length-2; j++) {
			data = data + td[j].innerHTML;
		}

		if (data) {
			if (data.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}
