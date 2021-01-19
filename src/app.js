import './style.css'
import {isValid} from './utils'

const form = document.querySelector('#form'),
    input = form.querySelector('#input_city'),
    postBtn = document.querySelector('#btn')

form.addEventListener('submit', weatherHandler)

input.addEventListener("input", () => {
    postBtn.disabled = !isValid(input.value);
});

function showCity(city) {
    document.querySelector('.city').innerHTML = city.name + ': '
}

function getWeather(data) {
    const date = new Date()

    const icons = {
        sun: `<i class="fas fa-sun"></i>`,
        cloudy: `<i class="fas fa-cloud"></i>`,
        rain: `<i class="fas fa-cloud-rain"></i>`,
        selfCloud: `<i class="fas fa-cloud-sun"></i>`,
        snow: `<i class="far fa-snowflake"></i>`
    }

    let icon;

    switch (data.weather['0'].description) {
        case 'Ясно'.toLocaleLowerCase():
            icon = icons.sun
            break;
        case 'Переменная облачность'.toLocaleLowerCase():
        case 'Облачно с прояснениями'.toLocaleLowerCase():
            icon = icons.selfCloud
            break;
        case 'Дождь'.toLocaleLowerCase():
            icon = icons.rain
            break;
        case 'снег'.toLowerCase():
            icon = icons.snow
            break
        default:
            icon = icons.cloudy
    }
    document.querySelector('.date').innerHTML = `
        ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}
    `
    document.querySelector('#show').innerHTML = `
        <div> ${icon} ${data.weather['0'].description[0].toUpperCase() + data.weather['0'].description.slice(1)}</div>
        <hr>
        <div> ${icon} Температура воздуха: ${Math.floor(data.main.temp - 273) + '°C' }</div>
        <hr>
        <div> ${icon} Ощущается как: ${Math.floor(data.main.feels_like - 273) + '°C'}</div>
        <hr>
        <div> ${icon} Влажность: ${data.main.humidity}</div>
        <hr>
        <div> ${icon} Ветер: ${data.wind.speed} м/с</div>
        <hr>

    `

}

function fetchWeather(id) {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${id}&lang=ru&appid=a9ebdb68b0dbf40182f5638efcca3afd`)
        .then(response => {
            if (response.ok) {
                response.json()
                .then(data => {
                    showCity(data)
                    getWeather(data)
                })
            } else {
                showCity({name: '<br>Неккоректные данные... Попробуйте заново.'})
            }
        }).catch(e => {
            console.log(e + 'Error');
            showCity({name: 'no data'})
        })
}

function weatherHandler(e) {
    e.preventDefault()

    if (isValid(input.value)) {
        postBtn.disabled = true

        const value = input.value
        localStorage.setItem('weather', value)
        fetchWeather(value).then(() => {
            postBtn.disabled = false
            input.value = ''
        }).catch(() => showCity({name: 'no data'}))
        
    }
    
}

let initialValue = localStorage.getItem('weather') ? localStorage.getItem('weather').toString() : 'Chegem' 

window.addEventListener('load', fetchWeather(initialValue))
