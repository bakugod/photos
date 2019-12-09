console.time(1)
console.time(2)

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(char => {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}

function parseStr(str){
	let headBuff
  let linkBuff
  let bodyBuff
  
  let start
  let end
  let firstBlock
  let secondBlock
  
  const linkPosition = str.indexOf('https://')
	for(let i = 0; i < str.length;i++){
  	if(str[i] === '#'){
      start = i
      end = str.indexOf('\n', start)      
      firstBlock = end
      headBuff = str.slice(start + 1, end)
    }
    if(linkPosition !== -1){
    	start = linkPosition
      end = str.indexOf('\n', start)
      secondBlock = start
      linkBuff = str.slice(start, end)
    }
    bodyBuff = str.slice(firstBlock, secondBlock)
  }
  return {
    headBuff, 
    bodyBuff,
    linkBuff,
  }
}


async function uploadPhotos() {
	const url = "https://api.github.com/repos/bakugod/photos/contents"
	const response = await fetch(url)
	const json = await response.json()
  
  json.forEach((img, i) =>{
    const image = document.createElement("img")
    image.src = json[i].download_url
    
  	img.size > 1000 && document.body.append(image)
  })
  
  console.timeEnd(2);
  return null
}

async function uploadText() {  
  const url = "https://api.github.com/repos/bakugod/photos/readme"
  const response = await fetch(url)
	const json = await response.json() 
  const text = b64DecodeUnicode(json.content)
  
  const p = document.createElement("p")
  const h1 = document.createElement("h1")
  const a = document.createElement("a")
  
  console.log(parseStr(text))
  const { headBuff, bodyBuff, linkBuff } = parseStr(text)
  h1.innerText = headBuff
  p.innerText = bodyBuff
  a.href = linkBuff
  a.innerText = linkBuff
  
  document.body.append(h1)
  document.body.append(p)
  document.body.append(a)
  
  console.timeEnd(1)
	return null
}


const init = (async() => Promise.resolve(uploadText()).then(uploadPhotos))()

