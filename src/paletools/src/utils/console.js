export function resetConsole(){
     // reset console
     let iframe = document.createElement('iframe');
     iframe.style.display = 'none';
     document.body.appendChild(iframe);
     window.console = iframe.contentWindow.console;
}