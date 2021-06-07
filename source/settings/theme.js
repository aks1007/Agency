lightTheme = document.getElementById('lightTheme')
tricolorTheme = document.getElementById('tricolorTheme')
classicTheme = document.getElementById('classicTheme')
darkTheme = document.getElementById('darkTheme')

lightTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'light')
    console.log('Light')
    location.reload()
})

tricolorTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'tricolor')
    console.log('')
    location.reload()
})

classicTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'classic')
    console.log('Classic')
    location.reload()
})

darkTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'dark')
    console.log('Dark')
    location.reload()
})

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    
    if(Theme == 'light')
    {
        lightTheme.focus()
    }

    if(Theme == 'tricolor')
    {
        tricolorTheme.focus()
    }

    if(Theme == 'classic')
    {
        classicTheme.focus()
    }

    if(Theme == 'dark')
    {
        darkTheme.focus()
    }
}

function shortCuts(event)
{
    x = event.keyCode

    if(x==27)
    {
        window.location = "settings.html"
    }
}

document.getElementById('back').tabIndex = -1;

