var modalIsUp = false

function verifyTicketId(tid) {
  var modal = $("#modal")
  var title = modal.find('.modal-title')
  var body = modal.find('.modal-body')
  var footer = modal.find('.modal-footer')

	footer.hide()
  body.text("Söker biljett nr " + tid)
	modal.modal()

	getTickets().then(function(range) {
		body.text("Nu har jag biljetten!")
		footer.show()
	}, function(err) {
		footer.show()
		body.text("Ett fel uppstod. Försök igen.")
		console.log(err)
	});
}

window.addEventListener('load', function () {
  var ticketid = document.querySelector('input[name=ticketid]');

  checkAuth()

  qr = init_qr(function(err, result) {
	 	if (err)
			return console.log(err.message)

		var re = /^F[0-9]{4}$/
		if (!result.match(re))
			return console.log("TicketId (" + result + ") didn't match " + re)

		if ((parseInt(result[1]) + 
			   parseInt(result[2]) + 
			   parseInt(result[3]) + 
			   parseInt(result[4])) % 10 !== 0)
			return console.log("TickedId (" + result +") control number mismatch")

		if (modalIsUp)
			return console.log("Modal already up")

		verifyTicketId(result)
	});

	$('#modal').on('hidden.bs.modal', function (e) {
		modalIsUp = false
		ticketid.focus()
	});

	$('#modal').on('shown.bs.modal', function (e) {
		modalIsUp = true
	});

	ticketid.addEventListener('keyup', function(event) {
		event.preventDefault()
		if (event.keyCode == 13) {
			var tid = ticketid.value
			if (!tid.startsWith('F'))
				tid = 'F'+tid
			if (!modalIsUp)
				verifyTicketId(tid)
			ticketid.value = ""
		}
	});
});

