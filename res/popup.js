window.onload = function()
{
	var ENABLEPASSCTL = 'EnablePassCtl';
	var ENABLESHARECTL = 'EnableShareCtl';

	var oCheckPass = document.getElementById("CheckBoxPass");
	var oCheckShare = document.getElementById("CheckBoxShare");

	var oBackPage = chrome.extension.getBackgroundPage();
	
	if ( "false" == oBackPage.getEnable(ENABLEPASSCTL) )
		oCheckPass.removeAttribute("checked");
	if ( "false" == oBackPage.getEnable(ENABLESHARECTL) )
		oCheckShare.removeAttribute("checked");

	oCheckPass.onclick = function()
	{
		oBackPage.setEnable(ENABLEPASSCTL, String(this.checked));
	}

	oCheckShare.onclick = function()
	{
		oBackPage.setEnable(ENABLESHARECTL, String(this.checked));
	}
}