// Consumo de APIS
const API_URL = 'https://api.shrtco.de/v2/';

const shortening = async (url) => {
    const res = await fetch(`${API_URL}shorten?url=${url}`);
    // const data = await res.json();

    return res.json();
};

//Validar Input
inputUrl.addEventListener('input', (e) => {
    if(inputUrl.validity.valueMissing || inputUrl.validity.typeMismatch){ //Si el campo esta vacio o no es valido
        spanError.textContent = 'Please add a link';
        inputUrl.classList.add('input-error');
    }else{
        spanError.textContent = '' ;
        inputUrl.classList.remove('input-error');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(!inputUrl.validity.valid){
        spanError.textContent = 'Please add a link';
        inputUrl.classList.add('input-error');
    }else{
        shortening(inputUrl.value)
        .then(res => {
            data = res.result;

            insertLocalStorage(data.original_link, data.full_short_link);
            createItemHistory(data.original_link, data.full_short_link);
        });
    }
});

// Crear Elemento
const createItemHistory = (originalLink, short_link) => {
    const itemHistory = document.createElement('article');
    itemHistory.classList.add('list-group-item', 'd-flex', 'flex-column','flex-md-row', 'justify-content-between', 'align-items-start', 'py-2', 'my-1');
    itemHistory.id = 'card-history';

    const pUrl = document.createElement('p');
    pUrl.classList.add('p-1', 'm-1');
    pUrl.textContent = originalLink;

    const divContainer = document.createElement('div');
    divContainer.classList.add('d-flex', 'align-items-start', 'justify-content-end', 'border-top', 'borde-md-none', 'flex-column', 'flex-md-row', 'w-100');

    const aShorten = document.createElement('a');
    aShorten.setAttribute('href', short_link);
    aShorten.classList.add('text-cyan', 'text-decoration-none', 'p-1', 'm-1', 'me-3');
    aShorten.textContent = short_link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-cyan', 'text-light', 'w-100');
    button.id = 'copy-button';
    button.textContent = 'Copy';

    divContainer.append(aShorten, button);
    itemHistory.append(pUrl, divContainer);

    // listGroup.appendChild(itemHistory);
    listGroup.insertBefore(itemHistory, listGroup.firstChild);

    cardHistory = document.querySelectorAll('#card-history div');
    copyLinks();
};

// Copiar links
const copyLinks = () =>{
    cardHistory.forEach(item => {
        const textCopy = item.children[0];
        const buttonCopy = item.children[1];    
    
        buttonCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(textCopy.textContent);
            
            buttonCopy.classList.remove('btn-cyan');
            buttonCopy.classList.add('copy-button');
            buttonCopy.textContent = 'Copied!';
    
            setTimeout(() => {
                buttonCopy.classList.remove('copy-button');
                buttonCopy.classList.add('btn-cyan');
                buttonCopy.textContent = 'Copy';
            }, 1000);
        });
    });
};

const insertLocalStorage = (original_link, short_link) =>{
    if (localStorage.length < 3) {
        localStorage.setItem(original_link, JSON.stringify(
            {
                originalLink: original_link,
                shortLink: short_link,
            }
        ));
    }else if(localStorage.length === 3){
        let key = localStorage.key(2);
        localStorage.removeItem(key);

        localStorage.setItem(original_link, JSON.stringify(
            {
                originalLink: original_link,
                shortLink: short_link,
            }
        ));
    }
};

const getLocalStorage = () => {

    if(localStorage.length > 0){
        for(let i=2; i>=0; i--) {
            let key = localStorage.key(i);
        // let keys = Object.keys(localStorage);
        // for(let key of keys) {
    
            let links = JSON.parse(localStorage.getItem(key));
    
            let originalLink = links.originalLink;
            let shortLink = links.shortLink;
    
            createItemHistory(originalLink, shortLink);
        }
    }
};

copyLinks();

getLocalStorage();