var modalIsUp = false

function formatTicketInfo(tid, name, company) {
  return "<h1>"+tid+"</h1><h3>"+name+"</h3><h4>"+company+"</h4>"
}

function verifyTicketId(tid) {
  var modal = $("#modal")
  var title = modal.find('.modal-title')
  var body = modal.find('.modal-body')
  var footer = modal.find('.modal-footer')
  var use = modal.find('.btn-primary')
  var cancel = modal.find('.btn-secondary')

  use.hide()
  cancel.hide()
  body.html("Söker biljett nr " + tid)
  modal.modal()

  getTickets().then(function(range) {
    var found = false
    var rowid = 0
    for (i = 0; i < range.values.length; i++) {
      var row = range.values[i];
      if (row[1] === tid) {
        found = true
        rowid = i + 2
        break
      }
    }

    if (!found) {
      body.text("Hittar inte biljettnummer " + tid)
    } else {
      body.html(formatTicketInfo(tid,row[3],row[4]))
      use.show()

      if (row[2] !== undefined && row[2].length !== 0) {
        body.html(body.html() +
          '<div class="alert alert-danger" role="alert">' +
          '<strong>BILJETTEN REDAN UTNYTTJAD</strong>' +
          '</div>')
        use.hide()
      } else {
        $(use).click(function() {
          body.text("Märker biljett...")
          use.hide()
          cancel.hide()
          markTicket(rowid).then(function() {
            modal.modal('hide')
          }, function(err) {
            body.text("Fel vid märkning!")
            console.log(err)
            cancel.show()
          })
          $(use).off()
        })
      }
    }
    cancel.show()
  }, function(err) {
    cancel.show()
    body.text("Ett fel uppstod. Försök igen.")
    console.log(err)
  })
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

