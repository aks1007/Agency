lightTheme = document.getElementById('lightTheme')
tricolorTheme = document.getElementById('tricolorTheme')
classicTheme = document.getElementById('classicTheme')
darkTheme = document.getElementById('darkTheme')

//ON-FOCUS
lightTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'light')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

tricolorTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'tricolor')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

classicTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'classic')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

darkTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'dark')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

//ON-HOVER
lightTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'light')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    lightTheme.blur()
    tricolorTheme.blur()
    classicTheme.blur()
    darkTheme.blur()
})

tricolorTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'tricolor')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

classicTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'classic')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

darkTheme.addEventListener('mouseover', () =>{
    localStorage.setItem('theme', 'dark')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})


//ON-CLICK
lightTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'light')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

tricolorTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'tricolor')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

classicTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'classic')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

darkTheme.addEventListener('click', () =>{
    localStorage.setItem('theme', 'dark')
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
})

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
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

