async function fetchElementsFromJSON() {
  const response = await fetch('module4.json');
  const data = await response.json();
  return data.elements;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function displayElements() {
  const mainDiv = document.getElementById('app');
  mainDiv.className = 'main-div';

  const elementsArray = await fetchElementsFromJSON();

  const numColumns = 6;

  function createDivWithElements(groupNumber, shuffledArray) {
    const groupedDiv = document.createElement('div');
    groupedDiv.className = 'grouped-div';

    const groupNumberElement = document.createElement('p');
    groupNumberElement.textContent = `Group ${groupNumber}`;
    groupNumberElement.className = 'group-number';
    groupedDiv.appendChild(groupNumberElement);

    const myTable = document.createElement('table');

    for (let i = 0; i < shuffledArray.length; i++) {
      const row = document.createElement('tr');
      const index = i + 1;
      const cellNumber = document.createElement('td');
      cellNumber.textContent = index.toString();
      cellNumber.className = 'number-cell'; // Add the class "number-cell" to the cell
      const cellElement = document.createElement('td');
      cellElement.textContent = shuffledArray[i];
      row.appendChild(cellNumber);
      row.appendChild(cellElement);
      myTable.appendChild(row);
    }

    groupedDiv.appendChild(myTable);
    mainDiv.appendChild(groupedDiv);
  }

  function shuffleAndDisplayElements() {
    mainDiv.innerHTML = '';
    const shuffledArray = [...elementsArray];
    shuffleArray(shuffledArray);

    const numGroups = Math.ceil(shuffledArray.length / numColumns);
    const displayInterval = 500; // 0.5 seconds

    for (let i = 1; i <= numGroups; i++) {
      const groupElements = shuffledArray.slice((i - 1) * numColumns, i * numColumns);
      setTimeout(() => createDivWithElements(i, groupElements), i * displayInterval);
    }
  }

  shuffleAndDisplayElements();

  const shuffleButton = document.getElementById('shuffleButton');
  shuffleButton.addEventListener('click', shuffleAndDisplayElements);

  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', downloadImage);
}

async function downloadImage() {
  const mainDiv = document.getElementById('app');

  const canvas = await html2canvas(mainDiv);

  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg', 1.0); // Use 'image/jpeg' and quality 1.0 for better image quality
  a.download = 'groups.jpg'; // Change the file extension to .jpg
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

displayElements();
