import { AppError } from './../common/app-error';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Response } from '@angular/http';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[];
  

  constructor(private service: PostService) {
  }

  ngOnInit() {
    this.service.getAll()
    .subscribe(posts => this.posts = posts);
  }

  createPost(input: HTMLInputElement) {
    let post = { title: input.value };
    this.posts.unshift(post);

    input.value = '';

    this.service.create(post)
      .subscribe(
        newPost => {
          post['id'] = newPost.id;
        }, 
        (error: AppError) => {
          this.posts.shift();
          
          if(error instanceof BadInput) {
            alert('Bad data!');
            // this.form.setErrors(error.originalError));
          } else {
            throw error;
          }
        });
  }

  updatePost(post) {
    this.service.update(post, {isRead: true})
      .subscribe(updatedPost => {
        console.log(updatedPost);
      });
    // this.http.put(this.url, JSON.stringify(post));
  }

  deletePost(post) {
    let index = this.posts.indexOf(post);
    this.posts.splice(index, 1);

    this.service.delete(post.id)
      .subscribe(
        null, 
        (error: AppError) => {
          this.posts.splice(index, 0, post);
          
          if(error instanceof NotFoundError) {
            alert('This post has been already deleted!');
          } else {
            throw error;
          }
        });
  }

}
