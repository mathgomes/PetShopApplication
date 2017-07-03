/* File: admin/profile.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing admin/profile.js');



function getUser(callback) {
	dbReadRecord(loggedUserId(), 'users', callback);
}



function customerProfile() {
	// maps record fields to the corresponding text field ids
	var fields = {
		'name': '#cProfileName',
		'email': '#cProfileEmail',
		'address': '#cProfileAddress',
		'phone': '#cProfilePhone',
	};

	refreshProfileInfo(fields);

	// Profile update callback
	$('#cProfileUpdate').click(function() {
		getUser(function(result) {
			if(result.success) {
				for(var f in fields) {
					result.data[f] = $(fields[f]).val();
				}
				dbUpdateRecord(result.data, 'users', _test_callback);
				loadNavbar(result.data);
				refreshInformation();
			}
		});
	});

	// Picture update callback
	$('#cProfileUpdatePhoto').click(function() {
		fileReaderCallback('#cProfileFile', updateProfilePhoto);
	});

	// Password update callback
	$('#cProfileUpdatePass').click(function() {
		getUser(function(result) {
			if(result.success) {
				var old_pass  = $('#cProfileOldPass').val();
				var new_pass1 = $('#cProfileNewPass').val();
				var new_pass2 = $('#cProfileConfirmPass').val();

				if(result.data.password != old_pass) {
					alert('Senha antiga errada.');
				}
				else if(new_pass1 != new_pass2) {
					alert('Confirmação de senha não bate.');
				}
				else {
					result.data.password = new_pass1;
					dbUpdateRecord(result.data, 'users', _test_callback);
				}
			}
		});
	});
}



function refreshProfileInfo(fields) {
	getUser(function(result) {
		if(result.success) {
			var data = result.data;

			$('#cTitle').html(data.name);
			$('#cProfilePhoto').attr('src', data.photo);

			for(var id in fields) {
				$(fields[id]).val(data[id]);
			}
		}
	});
}



// Reads the image from #cProfilePhoto and updates the
// user record on the database
function updateProfilePhoto(event) {
	var new_photo = event.target.result;
	$('#cProfilePhoto').attr('src', new_photo);

	getUser(function(result) {
		if(result.success) {
			result.data.photo = new_photo;
			dbUpdateRecord(result.data, 'users', _test_callback);
		}
	});
}