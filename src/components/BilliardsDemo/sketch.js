import p5 from "p5";

function sketch(p){
    /**
     * The World class will contain a list containing all
     * the rigidbodies to update. This will be a fixed
     * timestep to keep physics accurate.
     */
    class World {
        constructor(){
            // Class members
            this.bodies = [];
            this.collisions = [];
        }

        /**
         * Registers a body to be updated
         * @param {Body} body
         * @returns The body registered
         */
        registerBody(body){
            body.id = this.bodies.length;
            this.bodies.push(body);
            return body;
        }

        /**
         * Deletes the body with the ID supplied from the world
         * @param {Body} body 
         */
        deleteBody(body){
            // Remove the body at its index
            this.bodies.splice(body.id, 1);

            // Update other bodies for their indices
            for(let i = body.id; i < this.bodies.length; i++){
                this.bodies[i].id--;
            }
        }

        /**
         * Detects collisions within the world and adds manifolds for them
         */
        collisionDetection(){
            // Loop through every body
            for(let i = 0; i < this.bodies.length; i++){
                for(let k = i + 1; k < this.bodies.length; k++){
                    // References to bodies
                    let b1 = this.bodies[i];
                    let b2 = this.bodies[k];
                    
                    // Check flags
                    if(!b1.collidable) break;
                    if(!b2.collidable) continue;
                    
                    // Check each body
                    let manifolds1 = b1.intersects(b2);
                    let manifolds2 = b2.intersects(b1);

                    // Call the callback for the bodies
                    if(manifolds1.length > 0 && manifolds2.length > 0){
                        b1.collidedFunc(b1, b2);
                        b2.collidedFunc(b2, b1);

                        // Add manifold with smaller minimum translation vector
                        for(let manifold1 of manifolds1) for(let manifold2 of manifolds2){
                            if(manifold1.intersection < manifold2.intersection){
                                this.collisions.push(manifold1);
                            } else {
                                this.collisions.push(manifold2);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Responds to the manifolds and resets the manifold list to get ready for the next tick
         */
        collisionResolution(){
            // Resolve the collision
            for(let manifold of this.collisions){
                manifold.solve();
            }

            this.collisions = [];
        }

        /**
         * Updates the body's position and velocities with each tick
         */
        dynamicsResponse(dt){
            // Solve for dynamics
            for(let body of this.bodies){
                body.vel.add(p5.Vector.mult(body.acc, dt));
                body.pos.add(p5.Vector.mult(body.vel, dt));
                body.acc.mult(0);

                body.angVel += body.torque * dt;
                body.rotation += body.angVel * dt;
                body.torque = 0;
            }
        }

        /**
         * Update every body within the simulation
         * @param {float} deltaTime 
         */
        update(deltaTime){
            this.collisionDetection();
            this.collisionResolution();
            this.dynamicsResponse(deltaTime);
        }
    }

    let Utility = {
        /**
         * Determinant for two vectors
         * @param {p5.Vector} v1 
         * @param {p5.Vector} v2 
         */
        determinant(v1, v2){ return v1.x * v2.y - v1.y * v2.x; },

        /**
         * Function runs a line intersection algorithm and returns the
         * amount of intersection of edge2 against edge1
         * @param {p5.Vector} edge1 
         * @param {p5.Vector} edge2 
         * @returns {float}
         */
        lineIntersection(s1, e1, s2, e2){
            // Standard line intersection formula
            let xDifference = p.createVector(s1.x - e1.x, s2.x - e2.x);
            let yDifference = p.createVector(s1.y - e1.y, s2.y - e2.y);
            let divisor = this.determinant(xDifference, yDifference);

            if(divisor == 0) return -1;

            let d = p.createVector(this.determinant(s1, e1), this.determinant(s2, e2));
            let collision = p.createVector(this.determinant(d, xDifference) / divisor, this.determinant(d, yDifference) / divisor);
            return {x: collision.x, y: collision.y, overlap: divisor};
        }
    }

    /**
     * The body class will contain a position, rotation, and
     * assosciated velocities. This will get updated by the
     * physics world if dynamics are enabled. A collision
     * manifold may also change the values.
     */
    class Body {
        /**
         * Creates a new body for the physics world. A collider must be attached manually
         * @param {float} x 
         * @param {float} y 
         * @param {float} rotation 
         * @param {float} mass 
         */
        constructor(x, y, rotation, mass){
            this.pos = p.createVector(x, y); // The vector containing the position of the body
            this.vel = p.createVector(0, 0); // The vector containing the velocity
            this.acc = p.createVector(0, 0); // The vector containing acceleration forces
            this.rotation = rotation; // The float containing the rotation of the polygon
            this.angVel = 0; // The float containing the rotational velocity
            this.torque = 0;
            this.mass = mass;
            this.elasticity = 1;
            this.inertia = 100;
            this.static = false; // Controls whether or not the object can be moved with collisions
            this.isTrigger = false; // Whether or not the object is solid, useful for triggers
            this.collidable = true; // Whether or not collisions are detected at all
            this.id = -1; // ID to track within the physics world.

            this.colliders = []; // An array containing colliders for the body to hit

            this.collidedFunc = (self, other) => {}; // Collision callback
        }

        /**
         * Attaches a collider to the body
         * @param {Collider} collider 
         * @returns {Collider} The collider supplied
         */
        addCollider(collider){
            this.colliders.push(collider);
            return collider;
        }

        /**
         * Returns the transformed point of the collider based on the body's transform
         * @param {*} collider ID for the collider to access 
         * @param {*} point The ID of the point on the collider
         * @returns {p5.Vector}
         */
        getPoint(collider, point){
            // Get the local point
            let localP = this.colliders[collider].getPoint(point);

            // Transform the point in relation to the body
            let c = p.cos(this.rotation);
            let s = p.sin(this.rotation);

            let transformed = p.createVector(
                localP.x * c - localP.y * s,
                localP.x * s + localP.y * c
            );

            // Fix origin
            transformed.x += this.pos.x;
            transformed.y += this.pos.y;

            // Return the results
            return transformed;
        }

        /**
         * Returns true or false if an object is intersecting with another object using separating axis thoerem
         * @param {Body} body 
         * @returns {Manifold}
         */
        intersects(body){
            // Variables
            let manifolds = [];

            // Check every collider against each other
            for(let colliderID1 = 0; colliderID1 < this.colliders.length; colliderID1++){
                let c1 = this.colliders[colliderID1];

                for(let colliderID2 = 0; colliderID2 < body.colliders.length; colliderID2++){
                    let c2 = body.colliders[colliderID2];
                    let collision = true;

                    let minimumOverlap = Infinity;
                    let minimumTranslation = p.createVector(0, 0);
                    let maximumOverlap = -Infinity;
                    let maximumContact = p.createVector(0, 0);
                    
                    // Circle to circle collisions
                    if(c1 instanceof CircleCollider && c2 instanceof CircleCollider){
                        // Get distance
                        let relative = p5.Vector.sub(this.getPoint(colliderID1, 0), body.getPoint(colliderID2, 0));
                        let distance = relative.magSq();
                        let manifold = new Manifold(false, p.createVector(0, 0), 0, p.createVector(0, 0), this, body);
                        
                        if(distance < (c1.radius + c2.radius) * (c1.radius + c2.radius)){
                            manifold.collides = true;
                            manifold.normal = p5.Vector.normalize(relative);
                            manifold.intersection = (relative.mag() - (c1.radius + c2.radius)) * -1;
                            manifold.contactPoint = p5.Vector.mult(p5.Vector.add(body.getPoint(colliderID2, 0), this.getPoint(colliderID1, 0)), 0.5);
                        }

                        return [manifold];
                    }

                    // Loop through every edge of the collider
                    for(let i = 0; i < c1.vertices.length; i++){
                        let start = this.getPoint(colliderID1, i);
                        let end = this.getPoint(colliderID1, (i + 1) % c1.vertices.length);
                        let edge = p5.Vector.sub(end, start);
                        edge = p.createVector(edge.y, -edge.x);
                        edge.normalize();

                        let min1 = Infinity;
                        let max1 = -Infinity;
                        let min2 = Infinity;
                        let max2 = -Infinity;
                        
                        // Loop through every vertex of this polygon and get its projection
                        if(c1 instanceof CircleCollider){
                            // Circle collision on C1 should bypass
                            return [new Manifold(true, p.createVector(0, 0), Infinity, p.createVector(0, 0), this, body)];
                        } else {
                            // Polygon collisions
                            for(let k = 0; k < c1.vertices.length; k++){
                                let proj = edge.dot(this.getPoint(colliderID1, k));
                                min1 = p.min(proj, min1);
                                max1 = p.max(proj, max1);
                            }
                        }
                        
                        // Loop through every vertex of the other polygon and get its projection
                        if(c2 instanceof CircleCollider){
                            // Circle collisions
                            let center = body.getPoint(colliderID2, 0);
                            let proj = edge.dot(center);
                            min2 = p.min(proj - c2.radius, min2);
                            max2 = p.max(proj + c2.radius, max2);
                        } else {
                            // Polygon collisions
                            for(let k = 0; k < c2.vertices.length; k++){
                                let v = body.getPoint(colliderID2, k);
                                let proj = edge.dot(v);
                                min2 = p.min(proj, min2);
                                max2 = p.max(proj, max2);
                                
                                let intersection = Utility.lineIntersection(start, end, body.pos, v);
                                if(intersection.overlap > maximumOverlap){
                                    maximumOverlap = intersection.overlap;
                                    maximumContact = p.createVector(intersection.x, intersection.y);
                                }
                            }
                        }

                        // Check for a separating axis
                        let overlap = p.max(max2, min2) - p.min(max1, min1);
                        if(!(max2 >= min1 && max1 >= min2)){
                            collision = false;
                            break;
                        }

                        // Get minimum translation vector
                        if(overlap < minimumOverlap){
                            minimumOverlap = overlap;
                            minimumTranslation = edge;

                            if(c2 instanceof CircleCollider){
                                maximumOverlap = overlap;
                                maximumContact = p5.Vector.mult(p5.Vector.add(body.getPoint(colliderID2, 0), this.getPoint(colliderID1, 0)), 0.5);
                            }
                        }
                    }
                    
                    if(collision){
                        manifolds.push(new Manifold(true, minimumTranslation, minimumOverlap, maximumContact, this, body));
                    }
                }
            }

            return manifolds;
        }

        /**
         * Applies the current matrices for rendering
         */
        applyMatrices(){
            p.resetMatrix();
            p.translate(this.pos.x, this.pos.y);
            p.angleMode(p.DEGREES);
            p.rotate(this.rotation);
        }

        /**
         * Draw every collider attached as well as the center point
         */
        render(){
            for(let c of this.colliders){
                // Offset the shape
                this.applyMatrices();

                // Draw the collider
                c.render();
            }
        }
    }

    // Helper functions
    let bodyTypes = {
        createBoxBody(x, y, width, height, rotation, mass){
            let b = new Body(x, y, rotation, mass);
            b.addCollider(colliderTypes.createBoxCollider(0, 0, width, height, 0));

            return b;
        },
        createCircleBody(x, y, radius, mass){
            let b = new Body(x, y, 0, mass);
            b.addCollider(colliderTypes.createCircleCollider(0, 0, radius));

            return b;
        },
        createWorldBody(x, y, width, height, rotation){
            let b = new Body(x, y, rotation, Infinity);
            b.static = true;

            b.addCollider(colliderTypes.createBoxCollider(0, height, width + 200, 50, 0));
            b.addCollider(colliderTypes.createBoxCollider(0, -height, width + 200, 50, 0));
            b.addCollider(colliderTypes.createBoxCollider(width, 0, 50, height + 200, 0));
            b.addCollider(colliderTypes.createBoxCollider(-width, 0, 50, height + 200, 0));

            return b;
        }
    };

    /**
     * A collider will contain vertices and an offset vector
     * which will allow bodies to have multiple colliders
     */
    class Collider {
        /**
         * Constructs a new collider object to be attached to a body for collisions
         * @param {float} x The X offset of the collider with the parent
         * @param {float} y The Y offset of the collider with the parent
         * @param {float} rotation The rotational offset of the collider with the parent
         */
        constructor(x, y, rotation){
            this.pos = p.createVector(x, y);
            this.rotation = rotation;
            this.vertices = [];
        }

        /**
         * This function will add a vertex to the collider shape.
         * @param {float} x 
         * @param {float} y 
         */
        addPoint(x, y){
            this.vertices.push(p.createVector(x, y));
            return this.vertices.length - 1;
        }

        /**
         * Removes the point at the given position
         * @param {integer} n Index of the point
         */
        removePoint(n){
            this.vertices.splice(n, 1);
        }

        /**
         * Returns the tranformed point on the collider
         * @param {integer} point 
         * @returns {p5.Vector}
         */
        getPoint(point){
            // Create settings
            p.angleMode(p.DEGREES);

            // Get the local point
            let localP = this.vertices[point];

            // Transform the point in relation to the body
            let c = p.cos(this.rotation);
            let s = p.sin(this.rotation);

            let transformed = p.createVector(
                localP.x * c - localP.y * s,
                localP.x * s + localP.y * c
            );

            // Fix origin
            transformed.x += this.pos.x;
            transformed.y += this.pos.y;

            // Return data
            return transformed;
        }

        // Gets the collider type based on the amount of vertices supplied
        getType(){
            switch(this.vertices.length){
            case 0:
                return "invalid";
            case 1:
                return "point";
            case 2:
                return "line";
            default:
                return "polygon";
            }
        }

        /**
         * Debug rendering the collider
         */
        render(){
            rotate(this.rotation);
            translate(this.pos.x, this.pos.y);

            for(let i = 0; i < this.vertices.length; i++){
                let start = this.vertices[i];
                let end = this.vertices[(i + 1) % this.vertices.length];

                circle(start.x, start.y, 3);
                line(start.x, start.y, end.x, end.y);
            }
        }
    }

    class CircleCollider extends Collider {
        /**
         * Constructs a circle collider, not to have vertex functions used on.
         * @param {float} x The X offset of the collider with the parent
         * @param {float} y The Y offset of the collider with the parent
         * @param {float} radius The radius of the circle collider
         */
        constructor(x, y, radius){
            super(x, y, 0);
            this.radius = radius;
            this.addPoint(0, 0);
        }

        // Gets the collider type based on the amount of vertices supplied
        getType(){ return "circle"; }
        
        /**
         * Debug rendering the collider
         */
        render(){
            translate(this.pos.x, this.pos.y);
            circle(0, 0, this.radius * 2);
            circle(0, 0, 1);
        }
    };

    // Helper functions
    let colliderTypes = {
        createBoxCollider(x, y, width, height, rotation){
            let halfWidth = width / 2;
            let halfHeight = height / 2;

            let c = new Collider(x, y, rotation);
            c.addPoint(-halfWidth, -halfHeight);
            c.addPoint(halfWidth, -halfHeight);
            c.addPoint(halfWidth, halfHeight);
            c.addPoint(-halfWidth, halfHeight);

            return c;
        },
        createCircleCollider(x, y, radius){
            let c = new CircleCollider(x, y, radius);
            return c;
        }
    };

    /**
     * A manifold will contain the data for how to respond
     * to a collision. This should abstract away the idea
     * of different shapes and only use points for response.
     * This will allow the manifold to be used for any
     * kind of collision.
     */
    function lline(x1, y1, x2, y2){ line(x1, y1, x1 + x2, y1 + y2); }

    class Manifold {
        /**
         * Constructs a new manifold object
         * @param {boolean} collides 
         * @param {p5.Vector} normal 
         * @param {float} intersection 
         * @param {Body} body1
         * @param {Body} body2
         */
        constructor(collides, normal, intersection, contactPoint, body1, body2){
            this.collides = collides;
            this.normal = normal;
            this.intersection = intersection;
            this.contactPoint = contactPoint;
            this.body1 = body1;
            this.body2 = body2;
        }

        getImpulseScale(){
            let relativeVelocity = p5.Vector.sub(this.body2.vel, this.body1.vel);
            let restitution = p.min(this.body1.elasticity, this.body2.elasticity);

            let contact1 = p5.Vector.sub(this.contactPoint, this.body1.pos);
            let contact2 = p5.Vector.sub(this.contactPoint, this.body2.pos);

            let invMass1 = 1 / this.body1.mass;
            let invInert1 = 1 / this.body1.inertia;
            let invMass2 = 1 / this.body2.mass;
            let invInert2 = 1 / this.body2.inertia;

            let angEnergy1 = p5.Vector.mult(contact1.cross(this.normal), invInert1).cross(contact1);
            let angEnergy2 = p5.Vector.mult(contact2.cross(this.normal), invInert2).cross(contact2);

            // Impulse resolution equation
            let numerator = this.normal.dot(p5.Vector.mult(relativeVelocity, -(1 + restitution)));
            let denomator = (invMass1 + invMass2)/* + this.normal.dot(p5.Vector.add(angEnergy1, angEnergy2))*/;

            return numerator / denomator;
        }

        positionCorrection(){
            if(!this.body1.static) this.body1.pos.add(p5.Vector.mult(this.normal, this.intersection * 0.5));
            if(!this.body2.static) this.body2.pos.add(p5.Vector.mult(this.normal, this.intersection * -0.5));
        }

        impulseCorrection(){
            let impulse = this.getImpulseScale();
            let contact1 = p5.Vector.sub(this.contactPoint, this.body1.pos);
            let contact2 = p5.Vector.sub(this.contactPoint, this.body2.pos);
            
            if(!this.body1.static){
                this.body1.vel.sub(p5.Vector.mult(this.normal, impulse / this.body1.mass));
                // this.body1.angVel -= impulse * (1 / this.body1.inertia) * contact1.cross(this.normal).z;
            }

            if(!this.body2.static){
                this.body2.vel.add(p5.Vector.mult(this.normal, impulse / this.body2.mass));
                // this.body2.angVel += impulse * (1 / this.body2.inertia) * contact2.cross(this.normal).z;
            }
        }

        /**
         * Takes the collision and adjusts the position and velocity to match
         */
        solve(){
            if(this.normal.x == 0 && this.normal.y == 0) return;
            if(this.body1.isTrigger || this.body2.isTrigger) return;

            this.positionCorrection();
            this.impulseCorrection();
        }
    }

    /**
     * The ball class will contain a rigidbody as well as
     * information about the ball that has been placed.
     * This may include but is not limited to color and number.
     */
    class Ball {
        constructor(physics, x, y, color, number){
            this.rb = physics.registerBody(bodyTypes.createCircleBody(x, y, 6, 10));
            this.color = color;
            this.number = number;
        }

        render(){
            this.rb.applyMatrices();

            p.fill(this.color);
            p.circle(0, 0, this.rb.colliders[0].radius * 2);
            p.fill((p.brightness(this.color) < 85 || this.color == "blue") ? "white" : "black");
            p.textAlign(p.CENTER);
            p.textSize(10);
            p.text(this.number, -0.5, 4);
            p.fill("white");
        }
    }

    /**
     * An obstacle is a type of object that cannot be pushed
     * but will interact with the balls. They may be placed
     * in ways that would impede easy shots, or just be
     * annoying. They should be a random shape such as
     * a triangle up to an octagon.
     */
    class Obstacle {
        constructor(physics, x, y, radius, vertexCount){
            this.rb = physics.registerBody(new Body(x, y, 0, p.random(1, 100)));
            this.radius = radius;

            let c = new Collider(0, 0, 0);
            for(let v = 0; v < vertexCount; v++){
                p.angleMode(p.DEGREES);
                let r = v / vertexCount * 360;
                let x = p.cos(r) * radius - p.sin(r) * radius;
                let y = p.sin(r) * radius + p.cos(r) * radius;

                c.addPoint(x, y);
            }
            this.rb.addCollider(c);

            this.rb.static = true;
        }

        render(){
            this.rb.applyMatrices();

            p.fill(85);
            
            p.beginShape(p.TRIANGLE_FAN);
            p.vertex(0, 0);
            for(let i = 0; i < this.rb.colliders[0].vertices.length; i++){
                let v1 = this.rb.colliders[0].vertices[i];
                let v2 = this.rb.colliders[0].vertices[(i + 1) % this.rb.colliders[0].vertices.length];
                p.vertex(v1.x, v1.y);
                p.vertex(v2.x, v2.y);
            }
            p.endShape();
        }
    }

    let physics;
    let world;
    let goals = [];
    let obstacles = [];
    let circles = [];
    let potted = []; // List of the bodies that were scored
    let cueBall;
    let maxCueLength = 150;
    let grabPos;
    let gameState = {
        started: false,
        over: false,
        won: false,
        nextMove: true,
        obstacles: 3,
        debug: false
    };

    // Functions
    function setupTable(x, y){
        let index = 0;
        let rowSize = 1;
        let spacing = 14;
        let exit = false;

        while(!exit){
            for(let row = 0; row < rowSize && !exit; row++){
                for(let col = 0; col < row + 1 && !exit; col++){
                    let c = circles[index];
                    
                    c.rb.pos.x = x + (col - row / 2) * spacing;
                    c.rb.pos.y = y - row * spacing;

                    index++;
                    exit = index >= circles.length;
                }

                rowSize++;
            }
        }

        // Swap 5 and 8 so that 8 is in the middle
        let temp = circles[4].rb.pos;
        circles[4].rb.pos = circles[7].rb.pos;
        circles[7].rb.pos = temp;

        // Set cue ball position
        circles[15].rb.pos.x = p.width / 2;
        circles[15].rb.pos.y = p.height - p.height / 4;
    }

    function goalScored(self, other){
        // Save collision if it doesnt exist
        let exists = false;
        for(let pot of potted){
            if(pot.ball.id === other.id){
                exists = true;
                break;
            }
        }
        if(exists) return;

        potted.push({
            goal: self,
            ball: other
        });

        if(other.id === cueBall.rb.id){
            // Cue ball was potted, end game
            gameState.over = true;
            gameState.won = false;
        } else if(other.id === circles[7].rb.id){
            // 8 ball was potted, check if everything else was potted first
            if(potted.length >= 14){
                gameState.won = true;
            }

            gameState.over = true;
        } else {
            // Regular ball was potted
            other.collidable = false;
            other.vel.mult(0);
        }
    }

    function drawBackground(){
        p.resetMatrix();
        p.background(200);

        // Exterior border
        p.rectMode(p.CENTER);
        p.fill(54, 19, 0);
        p.rect(p.width / 2, p.height / 2, 270, 410);

        // Interior green
        p.fill(5, 102, 15);
        p.rect(p.width / 2, p.height / 2, 210, 350);

        // Holes
        p.fill(2, 38, 5);
        p.rect(95, 28, 24, 24, 10, 10, 10, 10); // Top left
        p.rect(85, p.height / 2, 20, 24, 10, 0, 0, 10); // Mid left
        p.rect(95, p.height - 28, 24, 24, 10, 10, 10, 10); // Bottom left
        p.rect(p.width - 95, 28, 24, 24, 10, 10, 10, 10); // Top right
        p.rect(p.width - 85, p.height / 2, 20, 24, 0, 10, 10, 0); // Mid right
        p.rect(p.width - 95, p.height - 28, 24, 24, 10, 10, 10, 10); // Bottom right

        // Reset
        p.fill(255);
    }

    function displayEnding(){
        p.resetMatrix();
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(2);
        p.textAlign(p.CENTER);
        p.text("Game over!", p.width / 2, p.height / 2);

        if(gameState.won){
            p.text("You won!", p.width / 2, p.height / 2 + 20);
        } else {
            p.text("You lost!", p.width / 2, p.height / 2 + 20);
        }

        p.strokeWeight(0.4);
    }

    // Initializer
    p.setup = () => {
        // Initialize window
        p.createCanvas(400, 405);
        physics = new World();

        // Setup table collisions
        world = physics.registerBody(bodyTypes.createWorldBody(p.width / 2, p.height / 2, 150, 220, 0));
        world.addCollider(colliderTypes.createBoxCollider(0, 185, 180, 20, 0));
        world.addCollider(colliderTypes.createBoxCollider(0, -185, 180, 20, 0));
        world.addCollider(colliderTypes.createBoxCollider(-115, 85, 20, 135, 0));
        world.addCollider(colliderTypes.createBoxCollider(115, 85, 20, 135, 0));
        world.addCollider(colliderTypes.createBoxCollider(-115, -85, 20, 135, 0));
        world.addCollider(colliderTypes.createBoxCollider(115, -85, 20, 135, 0));

        // Create goal areas
        goals.push(physics.registerBody(bodyTypes.createBoxBody(90, 24, 20, 25, 0, Infinity)));
        goals.push(physics.registerBody(bodyTypes.createBoxBody(85.5, p.height / 2, 10, 20, 0, Infinity)));
        goals.push(physics.registerBody(bodyTypes.createBoxBody(90, p.height - 24, 20, 25, 0, Infinity)));
        goals.push(physics.registerBody(bodyTypes.createBoxBody(p.width - 90, 24, 20, 25, 0, Infinity)));
        goals.push(physics.registerBody(bodyTypes.createBoxBody(p.width - 85.5, p.height / 2, 10, 20, 0, Infinity)));
        goals.push(physics.registerBody(bodyTypes.createBoxBody(p.width - 90, p.height - 24, 20, 25, 0, Infinity)));

        for(let g of goals){
            g.isTrigger = true;
            g.static = true;
            g.collidedFunc = goalScored;
        }

        // Create random obstacles
        for(let i = 0; i < gameState.obstacles; i++){
            obstacles.push(new Obstacle(physics, p.random(150, 250), p.random(75, 350), p.random(10, 30), p.random(3, 7)));
        }

        // Ugly but must be done, the standard colors are arbitrary.
        circles.push(new Ball(physics, 200, 200, "yellow", 1));
        circles.push(new Ball(physics, 200, 200, "blue", 2));
        circles.push(new Ball(physics, 200, 200, "red", 3));
        circles.push(new Ball(physics, 200, 200, "purple", 4));
        circles.push(new Ball(physics, 200, 200, "orange", 5));
        circles.push(new Ball(physics, 200, 200, "green", 6));
        circles.push(new Ball(physics, 200, 200, "burgundy", 7));
        circles.push(new Ball(physics, 200, 200, "black", 8));
        circles.push(new Ball(physics, 200, 200, "yellow", 9));
        circles.push(new Ball(physics, 200, 200, "blue", 10));
        circles.push(new Ball(physics, 200, 200, "red", 11));
        circles.push(new Ball(physics, 200, 200, "purple", 12));
        circles.push(new Ball(physics, 200, 200, "orange", 13));
        circles.push(new Ball(physics, 200, 200, "green", 14));
        circles.push(new Ball(physics, 200, 200, "burgundy", 15));
        circles.push(new Ball(physics, 200, 300, "white", " "));
        cueBall = circles[15];
        setupTable(200, 200);
    }

    // Runtime
    p.draw = () => {
        // Physics
        physics.update(1);

        // Rendering
        p.background(220);
        drawBackground();

        gameState.nextMove = true;
        for(let c of circles){
            // Slow down the circles a little every frame
            c.rb.vel.mult(0.98);

            // Dont allow another shot until everything slows down
            if(c.rb.vel.magSq() > 0.045) gameState.nextMove = false;

            // Render the circles
            c.render();
        }

        if(gameState.debug){
            world.render();

            for(let g of goals){
                g.render();
            }
        }

        for(let o of obstacles){
            o.render();
        }

        if(gameState.over){ displayEnding(); }

        if(!gameState.started){
            p.resetMatrix();
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.fill(255);
            p.text("Click and drag anywhere to begin", p.width / 2, p.height / 8);
        }

        // Logic
        for(let pot of potted){
            pot.ball.vel = p5.Vector.mult(p5.Vector.sub(pot.goal.pos, pot.ball.pos), 0.1);
        }

        if(grabPos != undefined && !gameState.over && gameState.nextMove){
            grabPos.x = p.mouseX;
            grabPos.y = p.mouseY;

            // Cap distance
            if(p5.Vector.sub(cueBall.rb.pos, grabPos).mag() > maxCueLength){
                grabPos = p5.Vector.mult(p5.Vector.normalize(p5.Vector.sub(cueBall.rb.pos, grabPos)), -maxCueLength);
                grabPos.add(cueBall.rb.pos);
            }

            
            p.resetMatrix();
            p.line(cueBall.rb.pos.x, cueBall.rb.pos.y, grabPos.x, grabPos.y);
        }
    }

    p.mousePressed = () => {
        // Start pulling back to show velocity line
        gameState.started = true;

        if(gameState.over || !gameState.nextMove){
            grabPos = undefined;
            return;
        }

        grabPos = p.createVector(p.mouseX, p.mouseY);
    }

    p.mouseReleased = () => {
        // Apply the forces
        if(gameState.over || !gameState.nextMove || grabPos == undefined) return;
        
        cueBall.rb.acc.add(p5.Vector.mult(p5.Vector.sub(grabPos, cueBall.rb.pos), -0.075));
        grabPos = undefined;
    }
}

export default sketch;