class Poll {
    constructor(root, title){
        this.root = root;
        this.selected = sessionStorage.getItem('poll-selected')
        this.endpoint = 'http://localhost:3002/poll'

        this.root.insertAdjacentHTML("afterbegin",
        `<div class = 'poll-title'>${ title }</div>`)

        this._refresh();
    }

    async _refresh() {
        const response = await fetch(this.endpoint)
        const data = await response.json();

        this.root.querySelectorAll('.poll-option')
        .forEach(option => {
            option.remove();
        })

        for (const option of data){
            const template = document.createElement('template')
            const fragment = template.content;

            template.innerHTML = `
            <div class="poll-option ${this.selected == option.label ? 'poll-option-selected': ''}">
                <div class="poll-option-fill"></div>
                <div class="poll-option-info">
                    <span class="poll-label">${ option.label }</span>
                    <span class="poll-percentage">${ option.percentage }%</span>
                </div>
            </div>
            `

            if(!this.selected){
                fragment.querySelector('.poll-option')
                .addEventListener('click', () => {
                    fetch(this.endpoint, {
                        method: "post",
                        body: `add=${ option.label }`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(() => {
                        this.selected = option.label

                        sessionStorage.setItem('poll-selected', option.label)

                        this._refresh();
                    })
                })
            }

            fragment.querySelector('.poll-option-fill').style.width = `${ option.percentage }%`

            this.root.appendChild(fragment)
        }

    }
}

const poll = new Poll(
    document.querySelector('.poll'), 
    'Which do you prefer?'
)