class Scene {
    objects = []
    transformations = []

    addObject(object) {
        this.objects.push(object);
    }
    
    removeObject(object){
        var i = this.objects.findIndex(element => element == object);
        if (i >= 0) {
            this.objects.splice(i, 1);
        }
    }

    addTransformation(transformation){
        this.transformations.push(transformation);
    }

    removeTransformation(transformation){
        var i = this.transformations.findIndex(element => element == transformation);
        if (i >= 0) {
            this.transformations.splice(i, 1);
        }
    }
}

