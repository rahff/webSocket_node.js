window.addEventListener('DOMContentLoaded', ()=>{
    const input = document.querySelector('#input')
    const button = document.querySelector('button');
    input.focus();
    function submit(){
        console.log('submit');
        const value = input.value;
        if(value){
            activedNsSocket.emit('message', {text: value, roomId: activedRoom._id})
        }
        input.value = "";
        input.focus()
    }
    button.addEventListener('click',submit)
    input.addEventListener('keyup',(event)=>{
        if(event.key === "Enter"){
            submit();
        }
    })
})