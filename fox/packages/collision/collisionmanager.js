import * as Colliders from './colliders/index.js'
/**
* The CollisionManager represents a way to obtain information from colliders (also in combination)
*
* @class CollisionManager
*/
export class CollisionManager{
    /**
     * Check if two objects are currently colliding and return intersections
     * @method colliding
     * @param {object} obj1 1st collider 
     * @param {object} obj2 2nd collider 
     * @returns {void}
     */
    static colliding({obj1, obj2}={}){  
        if(!(obj1 instanceof Colliders.Collider) || !(obj2 instanceof Colliders.Collider)){ console.warn("fox: collisions: you're asking for a collision between (at least) one non-collider object. fix that. ")}
        if(obj1.constructor.name=="RectangleCollider" && obj2.constructor.name=="RectangleCollider"){
            /*
             * helper functions for checking if intersection are in place
             */
            function calcAxis({axis, A, B}){
                let Aproj1UR = getAxisProjection({axis: axis, point: A.upperRight})
                let Aproj1UL = getAxisProjection({axis: axis, point: A.upperLeft})
                let Aproj1LR = getAxisProjection({axis: axis, point: A.lowerRight})
                let Aproj1LL = getAxisProjection({axis: axis, point: A.lowerLeft})

                let Anorm1UR = getDotProd({axis: axis, point: Aproj1UR})
                let Anorm1UL = getDotProd({axis: axis, point: Aproj1UL})
                let Anorm1LR = getDotProd({axis: axis, point: Aproj1LR})
                let Anorm1LL = getDotProd({axis: axis, point: Aproj1LL})

                let maxA = Math.max(Anorm1LL, Anorm1LR, Anorm1UL, Anorm1UR)
                let minA = Math.min(Anorm1LL, Anorm1LR, Anorm1UL, Anorm1UR)

                let Bproj1UR = getAxisProjection({axis: axis, point: B.upperRight})
                let Bproj1UL = getAxisProjection({axis: axis, point: B.upperLeft})
                let Bproj1LR = getAxisProjection({axis: axis, point: B.lowerRight})
                let Bproj1LL = getAxisProjection({axis: axis, point: B.lowerLeft})

                let Bnorm1UR = getDotProd({axis: axis, point: Bproj1UR})
                let Bnorm1UL = getDotProd({axis: axis, point: Bproj1UL})
                let Bnorm1LR = getDotProd({axis: axis, point: Bproj1LR})
                let Bnorm1LL = getDotProd({axis: axis, point: Bproj1LL})

                let maxB = Math.max(Bnorm1LL, Bnorm1LR, Bnorm1UL, Bnorm1UR)
                let minB = Math.min(Bnorm1LL, Bnorm1LR, Bnorm1UL, Bnorm1UR)

                if(minB <= maxA && maxB >= minA){
                    return true
                }else{
                    return false
                }
            }

            function getAxisProjection({axis, point}={}){
                let temp = (point.x*axis.x + point.y*axis.y)/(Math.pow(axis.x,2)+Math.pow(axis.y,2))
                return {
                    x: temp*axis.x,
                    y: temp*axis.y
                }
            }

            function getDotProd({axis, point}={}){
                return (axis.x*point.x + axis.y+point.y)
            }
            
            /*
             * helper functions for getting intersection points of rectangles 
             */
            function checkIntersections({obj1, obj2}){
                let center = obj2.position.add({vector: obj2.rotationPosition})
                let c_ = obj1.getCorners()
                let intersections = []
                let corners = {
                    upperLeft : {
                        x : center.x + ((c_.upperLeft.x-center.x)*Math.cos(-obj2.rotation) - (c_.upperLeft.y-center.y)*Math.sin(-obj2.rotation)),
                        y : center.y + ((c_.upperLeft.x-center.x)*Math.sin(-obj2.rotation) + (c_.upperLeft.y-center.y)*Math.cos(-obj2.rotation))
                    },
                    upperRight : {
                        x : center.x + ((c_.upperRight.x-center.x)*Math.cos(-obj2.rotation) - (c_.upperRight.y-center.y)*Math.sin(-obj2.rotation)),
                        y : center.y + ((c_.upperRight.x-center.x)*Math.sin(-obj2.rotation) + (c_.upperRight.y-center.y)*Math.cos(-obj2.rotation))
                    },
                    lowerLeft : {
                        x : center.x + ((c_.lowerLeft.x-center.x)*Math.cos(-obj2.rotation) - (c_.lowerLeft.y-center.y)*Math.sin(-obj2.rotation)),
                        y : center.y + ((c_.lowerLeft.x-center.x)*Math.sin(-obj2.rotation) + (c_.lowerLeft.y-center.y)*Math.cos(-obj2.rotation))
                    },
                    lowerRight : {
                        x : center.x + ((c_.lowerRight.x-center.x)*Math.cos(-obj2.rotation) - (c_.lowerRight.y-center.y)*Math.sin(-obj2.rotation)),
                        y : center.y + ((c_.lowerRight.x-center.x)*Math.sin(-obj2.rotation) + (c_.lowerRight.y-center.y)*Math.cos(-obj2.rotation))
                    },
                }
                if(pointInRect({point:corners.upperLeft, rect:obj2})) intersections.push(c_.upperLeft)
                if(pointInRect({point:corners.upperRight, rect:obj2})) intersections.push(c_.upperRight)
                if(pointInRect({point:corners.lowerLeft, rect:obj2})) intersections.push(c_.lowerLeft)
                if(pointInRect({point:corners.lowerRight, rect:obj2})) intersections.push(c_.lowerRight)
                return intersections
            }
            function pointInRect({point, rect}){
                return (point.x>=rect.position.x && point.x<=rect.position.x+rect.dimensions.width) && (point.y>=rect.position.y && point.y<=rect.position.y+rect.dimensions.height)
            }
            
            /*
             * get corners of the rectangles and intialize axis
             */
            let A = obj1.getCorners()
            let B = obj2.getCorners()
            let axis1 = {
                x : A.upperRight.x - A.upperLeft.x,
                y : A.upperRight.y - A.upperLeft.y
            }
            let axis2 = {
                x : A.upperRight.x - A.lowerRight.x,
                y : A.upperRight.y - A.lowerRight.y
            }
            let axis3 = {
                x : B.upperLeft.x - B.lowerLeft.x,
                y : B.upperLeft.y - B.lowerLeft.y
            }
            let axis4 = {
                x : B.upperLeft.x - B.upperRight.x,
                y : B.upperLeft.y - B.upperRight.y
            }
            
            /*
             * check if there are intersections and in case there are intersections, return the corners, that are intersecting
             */
            if(calcAxis({axis:axis1,A:A,B:B}) && calcAxis({axis:axis2,A:A,B:B}) && calcAxis({axis:axis3,A:A,B:B}) && calcAxis({axis:axis4,A:A,B:B})){
                let intersections = []
                intersections = intersections.concat(checkIntersections({obj1:obj1, obj2:obj2}))
                intersections = intersections.concat(checkIntersections({obj1:obj2, obj2:obj1}))
                return intersections
            }
        }else if(obj1.constructor.name=="RectangleCollider" && obj2.constructor.name=="CircleCollider" || obj2.constructor.name=="RectangleCollider" && obj1.constructor.name=="CircleCollider"){
            
            /*
             * helper functions for getting intersections points between circle and rect
             */
            function getIntersectionsWithLine({line, circle}={}){
                let intersections = []
                
                let x1 = line.x1 - circle.position.x - (circle.dimensions.width/2),
                    y1 = line.y1 - circle.position.y - (circle.dimensions.width/2),
                    x2 = line.x2 - circle.position.x - (circle.dimensions.width/2),
                    y2 = line.y2 - circle.position.y - (circle.dimensions.width/2)
                let dx = x2-x1,
                    dy = y2-y1,
                    dr = Math.sqrt(dx**2 + dy**2),
                    D = x1*y2 - x2*y1
                
                if(((circle.dimensions.width/2)**2 * dr**2 - D**2)>0){
                    let x_1 = (D*dy+sgn(dy)*dx*Math.sqrt((circle.dimensions.width/2)**2 * dr**2 - D**2))/ (dr**2),
                        y_1 = (-D*dx+Math.abs(dy)*Math.sqrt((circle.dimensions.width/2)**2 * dr**2 - D**2))/(dr**2)
                    let x_2 = (D*dy-sgn(dy)*dx*Math.sqrt((circle.dimensions.width/2)**2 * dr**2 - D**2))/(dr**2),
                        y_2 = (-D*dx-Math.abs(dy)*Math.sqrt((circle.dimensions.width/2)**2 * dr**2 - D**2))/(dr**2)
                    
                    let cord1 = {x:x_1+circle.position.x+(circle.dimensions.width/2),y:y_1+circle.position.y+(circle.dimensions.width/2)}
                    let cord2 = {x:x_2+circle.position.x+(circle.dimensions.width/2),y:y_2+circle.position.y+(circle.dimensions.width/2)}
                    
                    if(isABetweenA1A2({a:x_1, a1:x1, a2:x2}) && isABetweenA1A2({a:y_1, a1:y1, a2:y2})) intersections.push(cord1)
                    if(isABetweenA1A2({a:x_2, a1:x1, a2:x2}) && isABetweenA1A2({a:y_2, a1:y1, a2:y2})) intersections.push(cord2)
                    return intersections
                }
                
                function isABetweenA1A2({a, a1, a2}){
                    return a<=a1 && a>=a2 || a>=a1 && a<=a2
                }
                function sgn(x){
                    return (x<0) ? -1 : 1 
                }
                
                return []
            }
            
            //CIRCLE - RECT
            let circle = obj1.constructor.name=="CircleCollider" ? obj1 : obj2,
                rect = obj1.constructor.name=="RectangleCollider" ? obj1 : obj2
            
            //rotate circle around rect to perform basic circle - rect intersection calculation
            let rect_ = {
                x:rect.position.x, 
                y:rect.position.y, 
                width:rect.dimensions.width, 
                height:rect.dimensions.height
            }
            
            let rotationcenter = {
                x : rect.position.x + rect.rotationPosition.x,
                y : rect.position.y + rect.rotationPosition.y,
            }            
            
            let middle = {
                x : circle.position.x+circle.dimensions.width/2,
                y : circle.position.y+circle.dimensions.width/2,
            }
            let circle_ = {
                x : rotationcenter.x + ((middle.x -rotationcenter.x)*Math.cos(-rect.rotation) - (middle.y -rotationcenter.y)*Math.sin(-rect.rotation)) - circle.dimensions.width/2,
                y : rotationcenter.y + ((middle.x -rotationcenter.x)*Math.sin(-rect.rotation) + (middle.y -rotationcenter.y)*Math.cos(-rect.rotation)) - circle.dimensions.width/2,
                radius : circle.dimensions.width / 2
            }
            
            //collision testing with rotated circle
            let testX = circle_.x+circle_.radius;
            let testY = circle_.y+circle_.radius;

            if (circle_.x+circle_.radius < rect_.x) testX = rect_.x;
            else if (circle_.x+circle_.radius > rect_.x+rect_.width) testX = rect_.x+rect_.width;
            if (circle_.y+circle_.radius < rect_.y) testY = rect_.y;
            else if (circle_.y+circle_.radius > rect_.y+rect_.height) testY = rect_.y+rect_.height;

            let distance = (circle_.x+circle_.radius-testX)**2 + (circle_.y+circle_.radius-testY)**2;
            if(distance <= circle_.radius**2){
                //intersection found
                let line1 = {x1: rect.getCorners().upperLeft.x, y1: rect.getCorners().upperLeft.y, x2: rect.getCorners().upperRight.x, y2: rect.getCorners().upperRight.y}
                let line2 = {x1: rect.getCorners().upperRight.x, y1: rect.getCorners().upperRight.y, x2: rect.getCorners().lowerRight.x, y2: rect.getCorners().lowerRight.y}
                let line3 = {x1: rect.getCorners().lowerRight.x, y1: rect.getCorners().lowerRight.y, x2: rect.getCorners().lowerLeft.x, y2: rect.getCorners().lowerLeft.y}
                let line4 = {x1: rect.getCorners().lowerLeft.x, y1: rect.getCorners().lowerLeft.y, x2: rect.getCorners().upperLeft.x, y2: rect.getCorners().upperLeft.y}
                
                let intersections = []
                intersections = intersections.concat(getIntersectionsWithLine({line: line1, circle: circle}))
                intersections = intersections.concat(getIntersectionsWithLine({line: line2, circle: circle}))
                intersections = intersections.concat(getIntersectionsWithLine({line: line3, circle: circle}))
                intersections = intersections.concat(getIntersectionsWithLine({line: line4, circle: circle}))
                
                
                return intersections
            }
        }
        return false
    }
}