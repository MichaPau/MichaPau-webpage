---
---

window.addEventListener("load", function () {
	var formFeedback = document.getElementById("form-feedback");
	var mailContainer = document.getElementById("mail-container");
	
	function sendMail() {
		console.log("send mail");
		var xhr = new XMLHttpRequest();
		var fd = new FormData(form);
		
		xhr.addEventListener("load", function (ev) {
			console.log(ev.target.responseText);
			if (xhr.status == 200 && ev.target.responseText === "1") {
				mailContainer.innerHTML = "Thank you! Your mail has been send.";
			} else {
				mailContainer.innerHTML = "I am very sorry. There was an error while trying to send your mail.";
			}
			mailContainer.innerHTML += "<br><button id=\"return-button\" type=\"button\" onclick=\"location.href='{{site.baseurl}}/contact/';\">Return</button>";
		});
		xhr.addEventListener("error", function (ev) {
			console.log("send mail error");
			formFeedback.innerHTML = "I am very sorry. There was an error while trying to send your mail.";
		});
		
		xhr.open("POST", "{{site.baseurl}}/assets/php/mail.php");
		xhr.send(fd);
		
	}
	
	var form = document.getElementById("form-container");
	form.addEventListener("submit", function (ev) {
		ev.preventDefault();
		console.log("on submit");
		formFeedback.innerHTML = "Sending your mail. Please hold on.";
		sendMail();
	});
});