/* File: customer/services.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/services.js');



function customerServices() {
	function option(id, value) {
		return '<option id="' + id + '">' + value + '</option>';
	}

	dbReadAllRecords('services', function(result) {
		if(result.success) {
			result.data.forEach(function(service) {
				$('#cServiceList').append(option('cOptService' + service.id, service.name));
			});
		}
	});

	dbReadFromIndex(loggedUserId(), 'animals', 'owner', function(result) {
		if(result.success) {
			result.data.forEach(function(animal) {
				$('#cAnimalList').append(option('cOptAnimal' + animal.id, animal.name));
			});
		}
	});

	$('#cServiceSearch').click(function() {
		console.log($('#cServiceDate').val());
		console.log($('#cServiceList').val());
		console.log($('#cAnimalList').val());
	});
}



function refreshServicePage() {

}
