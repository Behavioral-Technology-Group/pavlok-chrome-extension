function save_options() {
  var select = document.getElementById("maxtab");
  var no_of_tabs = select.children[select.selectedIndex].value;
  localStorage.maxTabs = no_of_tabs;

  var userId = document.getElementById("userId").value;
  localStorage.userId = userId;
  
  var status = document.getElementById("status");
  status.innerHTML = "Option saved successfully!";
  setTimeout(function() {
    window.close();
  }, 1300);
}

function restore_options() {
  var favorite = localStorage.maxTabs;
  var userId = localStorage.userId;
  
  if (userId)
  {
  document.getElementById("userId").value=userId;
  }
  
  if (!favorite) {
    return;
  }
  
  var select = document.getElementById("maxtab");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);