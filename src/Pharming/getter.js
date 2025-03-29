/**
 * 
 * @param {Document} doc 
 */
function parseDoc(doc) {
    const carParks = doc.getElementsByTagName('d2lm:situationRecord');
    const carParksList = [...carParks].map(($el) => makeCarParkObj($el));
    return carParksList;
}

//https://stackoverflow.com/a/7394787
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
 * 
 * @param {Element} element 
 * @returns 
 */
function makeCarParkObj(element) {
    return {
        id: element.id,
        creationTime: new Date(element.getElementsByTagName('d2lm:situationRecordCreationTime')[0].textContent),
        name: decodeHtml(element.getElementsByTagName('d2lm:carParkIdentity')[0].textContent.split(':')[0].split(',').map((subLoc) => subLoc.trim()).filter((subLoc) => !!subLoc).map((subLoc) => 'norwich'.includes(subLoc.toLowerCase()) ? 'Norwich' : subLoc).join(', ')).split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase()).join(' '),
        location: {
            latitude: element.getElementsByTagName('d2lm:latitude')[0].textContent,
            longitude: element.getElementsByTagName('d2lm:longitude')[0].textContent
        },
        status: element.getElementsByTagName('d2lm:carParkStatus')[0].textContent,
        occupancy: +element.getElementsByTagName('d2lm:carParkOccupancy')[0].textContent,
        spacesTaken: +element.getElementsByTagName('d2lm:occupiedSpaces')[0].textContent,
        capacity: +element.getElementsByTagName('d2lm:totalCapacity')[0].textContent,
    };
}

export default async function getXML(subscription) {
    const response = await fetch(`${import.meta.env.VITE_PROXY_TARGET_URI}/proxy?target=https://datex.norfolk.cdmf.info/carparks/content.xml`);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const formatted = parseDoc(doc);
    subscription(formatted);
}