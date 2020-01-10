export const spyScrolling = () => {
    const sections = document.querySelectorAll('.section');

    window.onscroll = () => {
        const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

        for (let s in sections) {
            if (sections.hasOwnProperty(s) && sections[s].offsetTop <= scrollPos) {
                const id = sections[s].id;
                let node = document.querySelector('.active-nav-item');
                if (node) {
                    node.classList.remove('active-nav-item');
                }
                if (id !== 'intro') {
                    document.querySelector(`a[href*=${id}]`).classList.add('active-nav-item');
                }
            }
        }
    }
}