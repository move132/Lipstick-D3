//api datas

function apis(url) {
  return $.ajax('/apis', {});
}

function fetchData(){
    apis()
        .then((response) => {
            let param={
                id:response.id,
                name:response.name
            }
            setParentNode(param);
            setRelativeNodes({artists:response.brands},response.id,true);
        })
        .then(() =>{
            console.log('other')
        });
} 

function clickCircle(id,children) { 
    apis().then((response) => {
        let list;
        for (let i = 0; i < response.brands.length; i++) {
            if (response.brands[i].id===id) {
                list=response.brands[i].series;
            };
            if (children) {
                let res= response.brands[i].series;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].id===id) {
                        list= res[j].lipsticks
                    }
                };
            };
        };
        //console.log(list)
        if (list) {
            setRelativeNodes({artists:list},id);
        };
    })
}

function setParentNode(response) {
    ARTIST_INFO.name = response.name;
    if (!NODES_OBJ[`${response.id}`]) {
        response.chosen = true;
        NODES_OBJ[`${response.id}`] = response;
    } else {
        NODES_OBJ[`${response.id}`].chosen = true;
    } 
    clickedIds[response.id] = true; 
    CHOSEN_ARR.forEach((chosen) => {
        let linkKey = `${response.id}-${chosen.id}`;
        let linkKey2 = `${chosen.id}-${response.id}`;
        LINKS_OBJ[`${linkKey}`] = {
            "source": `${response.id}`,
            "target": `${chosen.id}`,
            "chosen": true
        };
        LINKS_OBJ[`${linkKey2}`] = {
            "source": `${response.id}`,
            "target": `${chosen.id}`,
            "chosen": true
        };
    });
    CHOSEN_ARR.push(response);
    renderSvg();
}

function setRelativeNodes(response, parentId,islogo) {
    artists = [response.artists[0]].concat(response.artists.slice(1, 100));
    artists.forEach((artist) => {
        artist.x = point[0];
        artist.y = point[1];
        if (islogo) {
            artist.islogo = islogo;
        };
        if (!NODES_OBJ[`${artist.id}`]) {
            NODES_OBJ[`${artist.id}`] = artist;
        }
        let linkKey = `${artist.id}-${parentId}`;
        let linkKey2 = `${parentId}-${artist.id}`;
        LINKS_OBJ[`${linkKey}`] = {
            "source": `${artist.id}`,
            "target": `${parentId}`
        };
        LINKS_OBJ[`${linkKey2}`] = {
            "source": `${parentId}`,
            "target": `${artist.id}`
        };
    });
    seriesColors(response)
    renderSvg();
}

function seriesColors(response){
    if (!response.artists) {return};
    let res= response.artists;
    let htmls=[];
    for (let i = 0; i < res.length; i++) {
        if (res[i].color) {
            htmls.push("<li data-color='"+res[i].color+"' style='background:"+res[i].color+"'></li>")
        };
    };
    $(".colors ul").html(htmls.join(""));
}