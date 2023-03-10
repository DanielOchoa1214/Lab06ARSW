//@author hcadavid

let app = (function (api) {
    let _author = "";
    let _blueprints = [];
    let publicFunctions = {};

    let _renderSearch = (data) => {
        $(document).ready(() => {
            objData = _dataToObject(data);
            _renderTable(objData, data);
            _calculateTotalPoints(objData);
            _showResults();
            _blueprints = objData;
        });
    }

    let _dataToObject = (data) => {
        let obj = data.map((x) => (
            {
                name: x.name,
                pointsNum : x.points.length
            }
        ));
        return obj;
    }

    let _renderTable = (objData, data) => {
        $("#author").text(`${data[0].author}'s blueprints`);
        $("#blueprints tbody").text("");
        objData.map((x) => {
            let markup = `
            <tr>
                <td>${x.name}</td>
                <td>${x.pointsNum}</td>
                <td><button class="btn btn-success" onclick="app.drawBlueprint('${data[0].author}', '${x.name}')">Open</button></td>
            </tr>`;
            $("#blueprints tbody").append(markup);
        });
    }

    let _calculateTotalPoints = (objData) => {
        let totalPoints = objData.reduce((total, i) => total + i.pointsNum, 0);
        $("#total-points").html(totalPoints);
    }

    let _showResults = () => {
        $("#successful-search").removeClass("remove");
        $("#search-error").addClass("remove");
        $("#search-section").removeClass("not-visible");
        $("#canvas-section").addClass("not-visible");
    }

    let _renderBlueprint = (data) => {
        $(document).ready(() => {
            _drawBlueprint(data);
            _showDrawing(data);
        });
    }

    let _drawBlueprint = (data) => {
        let points = data.points;
        let canvas = $("#blueprints-canvas")[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    let _showDrawing = (data) => {
        $("#blueprint-name").html(data.name);
        $("#canvas-section").removeClass("not-visible");
    }
 
    publicFunctions.setName = function (newName) {
        _author = newName;
    }

    publicFunctions.updateBlueprints = function (authorName) {
        api.getBlueprintsByAuthor(authorName, _renderSearch);
    }
    publicFunctions.drawBlueprint = function (authorName, bpName) {
        api.getBlueprintsByNameAndAuthor(authorName, bpName, _renderBlueprint);
    }

    return publicFunctions;

})(apiclient);


/*
Example of use:
var fun=function(list){
	console.info(list);
}
app.setName("svbujsfvbnsj")

apimock.getBlueprintsByAuthor("johnconnor",fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/