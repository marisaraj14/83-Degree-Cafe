var arr = ["Hello", "World", "Nice"];
    arr.forEach(element => {
        var node = document.createElement("LI");
        var txt = document.createTextNode(element);
        node.appendChild(txt);
        document.getElementById("list").appendChild(node);
    });
    function displayItem(){
        var dis=document.getElementById("inputs").value;
        arr.push(dis);

        var node2=document.getElementById("list");
        while(node2.hasChildNodes()){
            node2.removeChild(node2.childNodes[0]);
        }
        arr.forEach(element => {
            var node = document.createElement("LI");
            var txt = document.createTextNode(element);
            node.appendChild(txt);
            document.getElementById("list").appendChild(node);
        });
        
    }

