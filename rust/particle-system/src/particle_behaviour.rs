use macroquad::prelude::*;

use crate::bounce_logic::edges;
const SHOOT_P1_M: f32 = 180.0;
const SHOOT_P1_R: f32 = 10.0;
//const GRAVITY_ACCELERATION: f32 = 400.0;

pub struct Particle {
    pub mass: f32,
    pub radius: f32,
    pub position: Vec2,
    pub velocity: Vec2,
}
//function that returns a Particle type
pub fn particles_initialize() -> Particle {
    // Keep the range valid on small browser windows, too.
    let max_radius = (screen_width().min(screen_height()) * 0.2).clamp(2.0, 100.0);
    let radius = macroquad::rand::gen_range(1.0, max_radius);
    let max_number_x = screen_width() - radius;
    let max_number_y = screen_height() - radius;

    Particle {
        mass: radius,
        radius,
        position: Vec2 {
            x: macroquad::rand::gen_range(radius, max_number_x.max(radius)),
            y: macroquad::rand::gen_range(radius, max_number_y.max(radius)),
        },
        velocity: Vec2 {
            x: macroquad::rand::gen_range(-100.0, 100.0),
            y: macroquad::rand::gen_range(-100.0, 100.0),
        },
    }
}

pub fn shoot_particle() -> Particle {
    Particle {
        mass: SHOOT_P1_M,
        radius: SHOOT_P1_R,
        position: Vec2 {
            x: 20.0,
            y: screen_height() / 2.0,
        },
        velocity: Vec2 { x: 2400.0, y: 0.0 },
    }
}

pub fn shoot_particle_right() -> Particle {
    Particle {
        mass: SHOOT_P1_M,
        radius: SHOOT_P1_R,
        position: Vec2 {
            x: screen_width() - 50.0,
            y: screen_height() / 2.0,
        },
        velocity: Vec2 { x: -2400.0, y: 0.0 },
    }
}

pub fn create_particles() -> Vec<Particle> {
    let mut particles = Vec::new();
    for _ in 0..20 {
        particles.push(particles_initialize());
    }
    particles
}

// Borrow and move one group. Shots skip edge bouncing so they can leave the window.
// Collisions are checked in main after both groups have moved.
pub fn update_particle(particles: &mut [Particle], dt: f32, apply_edges: bool) {
    //loop over the vector, it's mutable to allow change.
    for particle in particles.iter_mut() {
        //gravity for the particles
        //
        //particle.velocity.y += GRAVITY_ACCELERATION * dt;
        //
        //velocity for the particle
        particle.position += dt * particle.velocity;
        if apply_edges {
            //applies edge logic
            edges(
                &mut particle.position,
                &mut particle.velocity,
                particle.radius,
            )
        }
    }
}
