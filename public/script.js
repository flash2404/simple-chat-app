$(function () {
  const socket = io();
  const $messages = $('#messages');
  const $input = $('#input');
  const $form = $('#form');

  $form.submit(function () {
    const message = $input.val().trim();
    if (message !== '') {
      socket.emit('chat message', message);
      $input.val('');
    }
    return false;
  });

  socket.on('chat message', function (msg) {
    $messages.append($('<li>').text(msg));
    scrollToBottom();
  });

  function scrollToBottom() {
    $messages.scrollTop($messages[0].scrollHeight);
  }
});
