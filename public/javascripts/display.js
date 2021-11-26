function displaynamespaces(namespaces, isActive){
    const namespaceContainer = document.querySelector('.list-namespaces');
    const items = namespaces.map((namespace) => createNamespaceItem(namespace, isActive === `/${namespace._id}`));
    namespaceContainer.innerHTML = '';
    namespaceContainer.prepend(...items);
}
function createNamespaceItem(namespace, isActive){
    const li = document.createElement('li');
    li.classList.add('item-namespaces', 'p-2', 'mb-2');
    if(isActive){
        li.classList.add('active');
    }
    li.innerHTML = `<img src="${namespace.imgUrl}">`;
    return li
}
function displayrooms(rooms, isActive){
    const roomContainer = document.querySelector('.room-list');
    const items = rooms.map((room) => createRoomItem(room, isActive === room._id));
    roomContainer.innerHTML = '';
    roomContainer.prepend(...items);
}
function createRoomItem(room, isActive){
    const li = document.createElement('li');
    li.classList.add('room-item', 'p-2', 'm-3');
    if(isActive){
        li.classList.add('active');
    }
    li.innerHTML = `# ${room.title}`;
    return li
}
function displayMesssages(messages){
    const messageContainer = document.querySelector('.list-message');
    const items = messages.map((msg) => createMessageItem({...msg, time: new Date(msg.updatedAt).toLocaleDateString()}));
    messageContainer.innerHTML = '';
    messageContainer.prepend(...items);
    if(items.length > 0){
        items[items.length - 1].scrollIntoView({behavior: "smooth"})
    }
}
function createMessageItem(message){
    const li = document.createElement('li');
    li.classList.add('message-item', 'd-flex', 'flew-row', 'mb-2');
    li.innerHTML = ` 
    <span class="mr-1">${message.time}</span>
    <strong class="mr-3">${message.authorName}</strong>
    <span class="flex-fill">
        ${message.data}
    </span>`;
    return li;
}