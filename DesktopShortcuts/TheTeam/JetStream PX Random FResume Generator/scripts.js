// Load random data from external JSON files
function getRandomData(file) {
    return fetch(file)
      .then(response => response.json())
      .then(data => data[Math.floor(Math.random() * data.length)]);
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    // Get random values from JSON files
    const picture = await getRandomData('pictures.json');
    const country = await getRandomData('country.json');
    const givenName = await getRandomData('givenName.json');
    const middleInitial = await getRandomData('middleInitial.json');
    const surname = await getRandomData('surname.json');
    const vehicle = await getRandomData('vehicle.json');
    const bloodType = await getRandomData('bloodType.json');
  
    // Update the HTML elements
    document.getElementById('profilePic').src = picture;
    document.getElementById('name').innerText = `${givenName} ${middleInitial}. ${surname}`;
    document.getElementById('country').innerText = country;
    document.getElementById('vehicle').innerText = vehicle;
    document.getElementById('bloodType').innerText = bloodType;
  });
  