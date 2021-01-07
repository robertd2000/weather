import './style.css'
import {isValid} from './utils'

console.log('Hi');
const form = document.querySelector('#form'),
    input = form.querySelector('#input_city'),
    postBtn = document.querySelector('#btn')

form.addEventListener('submit', weatherHandler)

input.addEventListener("input", () => {
    postBtn.disabled = !isValid(input.value);
});

function showCity(city) {
    // console.log(city.ok);
    document.querySelector('.city').innerHTML = city.name + ': '
}

function getWeather(data) {
    const date = new Date()
    // const icon = `<i class="fas fa-cloud"></i>`

    const icons = {
        sun: `<i class="fas fa-sun"></i>`,
        cloudy: `<i class="fas fa-cloud"></i>`,
        rain: `<i class="fas fa-cloud-rain"></i>`,
        selfCloud: `<i class="fas fa-cloud-sun"></i>`
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
    // return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${id}&lang=ru&appid=a9ebdb68b0dbf40182f5638efcca3afd`)
    //     .then(response => response.json())
    //     // .then(data => console.log(data.name))
    //     // .then(data => showCity(data))
    //     .then(data => {
    //         showCity(data)
    //         getWeather(data)
    //     })
    //     .catch(e => {
    //         console.log('Error: ' + e)
    //     })
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${id}&lang=ru&appid=a9ebdb68b0dbf40182f5638efcca3afd`)
        .then(response => {
            if (response.ok) {
                // console.log(response.ok);
                response.json()
                .then(data => {
                    showCity(data)
                    getWeather(data)
                })
            } else {
                // console.log('Error: ' + e)
                showCity('Неккоректные данные...')

                // throw Error(`is not ok: ` + response.status)
            }
        }).catch(e => {
            console.log('Error');
            showCity({name: 'no data'})
        })
}

function weatherHandler(e) {
    e.preventDefault()

    if (isValid(input.value)) {
        postBtn.disabled = true

        const value = input.value
        fetchWeather(value).then(() => {
            // console.log('object');
            postBtn.disabled = false
            input.value = ''
        }).catch(() => showCity({name: 'no data'}))
        
    }
    
}


// fetchWeather('524901')

window.addEventListener('load', fetchWeather('Нальчик'))
