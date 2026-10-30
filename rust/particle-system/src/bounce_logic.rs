use crate::particle_behaviour::Particle;
use macroquad::prelude::*;
const FRICTION_FORCE: f32 = 0.92;
const FRICTION: f32 = 0.92;
pub fn edges(position: &mut Vec2, velocity: &mut Vec2, radius: f32) {
    if position.x <= radius {
        position.x = radius;
        velocity.x = velocity.x.abs() * FRICTION_FORCE;
    } else if position.x >= screen_width() - radius {
        position.x = screen_width() - radius;
        velocity.x = -velocity.x.abs() * FRICTION_FORCE;
    }

    if position.y <= radius {
        position.y = radius;
        velocity.y = velocity.y.abs() * FRICTION_FORCE;
    } else if position.y >= screen_height() - radius {
        position.y = screen_height() - radius;
        if velocity.y.abs() < 10.0 {
            velocity.y = 0.0;
        } else {
            velocity.y = -velocity.y.abs() * FRICTION_FORCE;
        }
        velocity.x *= FRICTION;
        if velocity.x.abs() < 0.1 {
            velocity.x = 0.0;
        }
    }
}
// Check each pair within one group exactly once.
// The mutable slice borrows the vector's particles without moving them.
pub fn detect_particle(particles: &mut [Particle]) {
    for i in 0..particles.len() {
        // Separate the current particle from all later particles. These slices
        // do not overlap, so Rust allows a mutable borrow from each at once.
        let (a_and_previous, after_a) = particles.split_at_mut(i + 1);
        let a = &mut a_and_previous[i];

        // Only later particles are checked: no self-collisions or repeated pairs.
        for b in after_a.iter_mut() {
            resolve_collision(a, b);
        }
    }
}

// Check every original particle against every shot, keeping both vectors separate.
pub fn detect_between(particles: &mut [Particle], shooting_particles: &mut [Particle]) {
    for a in particles.iter_mut() {
        // Restart the inner loop for each original particle.
        // Separate groups already provide distinct mutable borrows; no split is needed.
        for b in shooting_particles.iter_mut() {
            resolve_collision(a, b);
        }
    }
}

// Both detection functions reuse this calculation. These references modify the
// actual particles in their original vectors, without copying or moving them.
fn resolve_collision(a: &mut Particle, b: &mut Particle) {
    //offset points from a's centre toward b's centre.
    //it's vector point (x2-x1)
    let offset = b.position - a.position;
    //distance is |d| = sqrt((x2-x1)²).
    //ie the magnitude.
    let distance = offset.length();

    let touching_distance = a.radius + b.radius;

    if distance < touching_distance {
        //direction is in this case a normalized unit vector of direction
        let direction = if distance > 0.0 {
            offset / distance
        } else {
            //edge case
            // Two centres can occasionally be exactly equal; in that case
            // choose an arbitrary direction so division by zero is avoided.
            vec2(1.0, 0.0)
        };

        let overlap = touching_distance - distance;

        //moves the particles if overlap
        a.position -= direction * (overlap / 2.0);
        b.position += direction * (overlap / 2.0);

        let p1_m = a.mass;
        let p2_m = b.mass;

        //the velocity on the line of direction
        let p1_u = a.velocity.dot(direction);
        let p2_u = b.velocity.dot(direction);
        //calculates the particles velocity after
        let p1_v_n = ((p1_m - p2_m) / (p1_m + p2_m)) * p1_u + ((2.0 * p2_m) / (p1_m + p2_m)) * p2_u;
        let p2_v_n = ((2.0 * p1_m) / (p1_m + p2_m)) * p1_u + ((p2_m - p1_m) / (p1_m + p2_m)) * p2_u;

        let p1_delta_v = p1_v_n - p1_u;
        let p2_delta_v = p2_v_n - p2_u;

        //convert scala back to a vector and add to the existing velocity
        a.velocity += (p1_delta_v * direction) * FRICTION_FORCE;
        b.velocity += (p2_delta_v * direction) * FRICTION_FORCE;
    }
}
