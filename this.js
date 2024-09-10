const dataTemplate = document.querySelector('.data-template')
const container = document.querySelector('.dynamic-box')
let data=[
    {
        eventImage: "https://example.com/image1.jpg",
        eventName: "Music Concert",
        eventLocation: "Central Park, NY",
        eventTime: "2024-09-15 18:00"
    },
    {
        eventImage: "https://example.com/image2.jpg",
        eventName: "Art Exhibition",
        eventLocation: "Downtown Gallery, LA",
        eventTime: "2024-09-20 10:00"
    },
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    
    
];//this data would store json result
data.map(user =>
{
    const card = dataTemplate.content.cloneNode(true).children[0]
    const eventImage = card.querySelector('.eventImage')
    const eventName = card.querySelector('.eventName')
    const eventLocation = card.querySelector('.eventLocation')
    const eventTime = card.querySelector('.eventTime')

    eventImage.src = user.eventImage;  // Set image source
    eventName.textContent = user.eventName;  // Set event name text
    eventLocation.textContent = user.eventLocation;  // Set event location text
    eventTime.textContent = user.eventTime;  // Set event time text
    container.append(card)
}
).catch(error => console.error(error))