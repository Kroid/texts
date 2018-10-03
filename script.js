var editor = new Quill('#editor', {
  // modules: { toolbar: '#toolbar' },
  modules: {
    toolbar: [
      ['bold', 'italic'],
      // ['link', 'blockquote', 'code-block', 'image'],
      // [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  },
  theme: 'snow'
});

// $('#text').flowtype({
//    // minimum : 500,
//    // maximum : 1000,
//    // fontRatio : 30,
//    minFont   : 16,
//    maxFont   : 20,
// });

$( "#editor-form" ).submit(function( event ) {
  var text = parseEditorText();
  $('#text').html(text);

  event.preventDefault();
});

$(document).on('mouseover', '.word', function(e) {
  $(this).css('color', 'red');
  $(this).css('cursor', 'pointer');
})

$(document).on('mouseleave', '.word', function(e) {
  $(this).css('color', 'black');
  $(this).css('cursor', 'auto');
})

$(document).on('click tap touchstart', '.word', function(e){
  var word = $(this).text().trim();
  word = parseWord(word);
  if (!word.length) return;

  $(this).css('color', 'red');
  $(this).css('cursor', 'pointer');

  let link = `https://wooordhunt.ru/word/${word}`;
  window.open(link,'_blank');
});

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

function parseEditorText() {
  var data = editor.getContents();
  var strings = data.ops.map((obj) => {
    if (typeof obj.insert != 'string') {
      return '';
    }

    var str = obj.insert;
    // str = str.replace("\n", "<br>");
    var lines = str.split("\n");
    str = lines.filter((line) => {
      return true;
      return line.length;
    }).map((line) => {
      return line.split(' ').map((part) => {
        return `<span class="word">${part}</span>`;
      }).join(' ');
    }).join("<br>");

    if (obj.attributes) {
      if (obj.attributes.bold) {
        str = `<strong>${str}</strong>`;
      }
      if (obj.attributes.italic) {
        str = `<em>${str}</em>`;
      }

      if (obj.attributes.color) {
        str = `<span style="color: ${obj.attributes.color};">${str}</span>`;
      }

      if (obj.attributes.align) {
        str = `<span style="display: block; text-aling: ${obj.attributes.align}">${str}</span>`
      }
    }

    return str;
  });

  var text = strings.join('');
  return text;
}

function parseWord(word) {
  word = word.trim();
  if (!word.length) return '';

  if (!isLetter(word[0])) {
    word = word.substring(1);
    word = parseWord(word);
  }

  if (!isLetter(word[word.length - 1])) {
    word = word.substring(0, word.length - 1);
    word = parseWord(word);
  }

  return word;
}


// function getSelectedWordAndUnselect() {
//   var s = window.getSelection();
//   var range = s.getRangeAt(0);
//   var node = s.anchorNode;
//
//   while(range.toString().indexOf(' ') != 0) {
//     range.setStart(node,(range.startOffset -1));
//   }
//
//   range.setStart(node, range.startOffset +1);
//
//   do{
//     range.setEnd(node,range.endOffset + 1);
//   } while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
//
//   var str = range.toString().replace(/[^0-9a-z]/gi, ' ').trim();
//
//   s.removeAllRanges();
//
//   return str;
// }
