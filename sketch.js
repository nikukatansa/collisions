var particles;
var MAX_PARTICLES = 20;
var MAX_ATTEMPTS = 1000;

function setup() {
  createCanvas(800,600);
  ellipseMode(RADIUS);
  
  particles = [];
  attempts = 0;
  
  while (particles.length < MAX_PARTICLES){
    p = new Particle(random(15,30));
    var overlaps = false;
    for (var i=0; i < particles.length; i++){
      if (dist(p.pos.x, p.pos.y, particles[i].pos.x, particles[i].pos.y) < p.radius + particles[i].radius){
        overlaps = true;
        break;
      }
    }
    if (overlaps == false){
      particles.push(p);
    }
    attempts++;
    if (attempts == MAX_ATTEMPTS) {
      break;
    }
  }
}

function draw() {
  background(51);
  noStroke();
  for (var i=0; i < particles.length; i++){
    var particle = particles[i];
    fill(particle.pcolor);
    ellipse(particle.pos.x, particle.pos.y, particle.radius, particle.radius);
    particle.nextpos.x = particle.pos.x + particle.velocity.x;
    particle.nextpos.y = particle.pos.y + particle.velocity.y;
  }
  
  // Collision detection
  for (var i=particles.length-1; i >= 0; i--){
    for (var j=0; j < i; j++){
      var n1 = particles[i].nextpos;
      var n2 = particles[j].nextpos;
      if (dist(n1.x, n1.y, n2.x, n2.y) < particles[i].radius + particles[j].radius) {
        collide(i,j);
      }      
    }
  }
  
  
  // Move particles
  for (var i=0; i < particles.length; i++){
    var particle = particles[i];
    particle.pos.x = particle.nextpos.x;
    particle.pos.y = particle.nextpos.y;
    if (particle.pos.x > width - particle.radius)  { particle.velocity.x = -particle.velocity.x; }
    if (particle.pos.x < particle.radius)          { particle.velocity.x = -particle.velocity.x; }
    if (particle.pos.y > height - particle.radius) { particle.velocity.y = -particle.velocity.y; }
    if (particle.pos.y < particle.radius)          { particle.velocity.y = -particle.velocity.y; }
  }
    
}

function collide(i, j) {
  var x1_x2 = p5.Vector.sub(particles[i].pos, particles[j].pos);
  var x2_x1 = p5.Vector.sub(particles[j].pos, particles[i].pos);
  var dotProd = p5.Vector.dot(p5.Vector.sub(particles[i].velocity, particles[j].velocity), x1_x2);
  var sqMag = x1_x2.magSq();
  var scale1 = 2 * particles[j].mass * dotProd / (sqMag * (particles[i].mass + particles[j].mass));
  var scale2 = 2 * particles[i].mass * dotProd / (sqMag * (particles[i].mass + particles[j].mass));
  var v1_after = p5.Vector.sub(particles[i].velocity, p5.Vector.mult(x1_x2, scale1));
  var v2_after = p5.Vector.sub(particles[j].velocity, p5.Vector.mult(x2_x1, scale2));
    
  particles[i].velocity = v1_after;
  particles[j].velocity = v2_after;
  particles[i].nextpos.x = particles[i].pos.x + particles[i].velocity.x;
  particles[j].nextpos.y = particles[j].pos.y + particles[j].velocity.y;
}

function Particle(radius) {
  this.radius = radius;
  this.mass = floor(PI * radius * radius);
  this.pos = createVector(random(radius, width-radius), random(radius, height-radius));
  this.nextpos = createVector(this.pos.x, this.pos.y);
  this.velocity = createVector(random(-5, 5), random(-5, 5));
  this.pcolor = color(random(255), random(255), random(255), 255);
}