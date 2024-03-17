function menuOpen(x) {
	x.classList.toggle("change");
	document.getElementById("dropdown").style.height = "94%";
	document.body.style.overflow = "hidden";
	document.getElementById("dropdownmenu").setAttribute("onclick", "menuClose()");
}

function menuClose() {
	dropdownmenu.classList.toggle("change");
	document.getElementById("dropdown").style.height = "0%";
	document.body.style.overflow = "visible";
	document.getElementById("dropdownmenu").setAttribute("onclick", "menuOpen(this)");
}