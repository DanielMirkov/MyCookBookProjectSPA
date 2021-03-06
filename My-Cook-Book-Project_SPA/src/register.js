async function onSubmit(data) {
    if (data.password != data.rePass) {
        return console.error('Passwords don\'t match');
    }

    const body = JSON.stringify({
        email: data.email,
        password: data.password,
    });

    try {
        const response = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        const data = await response.json();
        if (response.status == 200) {
            sessionStorage.setItem('authToken', data.accessToken);
            onSucccess();
        } else {
            throw new Error(data.message);
        }
    } catch (err) {
        console.error(err.message);
    }
}

let main;
let section;
let onSucccess;


export function setupRegister(mainTarget, sectionTarget, onSucccessTarget) {

    main = mainTarget;
    section = sectionTarget;
    onSucccess = onSucccessTarget;

    const form = section.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, {
            [k]: v
        }), {}));
    }));
}

export function showRegister() {
    main.innerHTML = '';
    main.appendChild(section);
}