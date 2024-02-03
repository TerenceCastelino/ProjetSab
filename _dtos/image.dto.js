class ImageDTO {
    constructor(data) {


        this.idImage = data.idImage
        this.chemin = data.chemin
        this.nomImage = data.nomImage
        this.model = data.model
    }
}

module.exports = ImageDTO