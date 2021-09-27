function updateNameAndEmail(name, email) {
    // this function make no sense because '#userName' and '#userEmail DOM elements does not exist
    if ($("#userName")) { $("#userName").html(name); }
    if ($("#userEmail")) { $("#userEmail").html(email); }
}

export default updateNameAndEmail;