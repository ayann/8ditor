$(document).ready(function() {
  var Download = {
    click : function(node) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(ev);
    },
    encode : function(data) {
            return 'data:application/octet-stream;base64,' + btoa( data );
    },
    link : function(data, name){
        var a = document.createElement('a');
        a.download = name || self.location.pathname.slice(self.location.pathname.lastIndexOf('/')+1);
        a.href = data || self.location.href;
        return a;
    }
  };

  Download.save = function(data, name){
    this.click(
        this.link(
            this.encode( data ),
            name
        )
    );
  };

  $('#save_btn').click(function(event) {
    event.preventDefault();
    var content = editor.getSession().getValue();
    if (content.length > 0)
      Download.save(content, '8ditor.txt');
    else{
      swal({
        title: "Oops...",
        text: "Il n'y a pas de code à sauvegarder!",
        type: "error",
        confirmButtonColor: "#00bfa5",
      })
    }
  });
});
