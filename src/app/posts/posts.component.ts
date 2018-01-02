import { AppError } from './../common/app-error';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Response } from '@angular/http';
import { AppError } from '../common/app-error';
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
    this.service.getPosts()
    .subscribe(response => {
      this.posts = response.json();
    }, error => {
      alert('An unexpected error occurred!');
      console.log(error);
    });
  }

  createPost(input: HTMLInputElement) {
    let post = { title: input.value };
    input.value = '';

    this.service.createPost(post)
      .subscribe(
        response => {
          post['id'] = response.json().id;
        }, 
        (error: AppError) => {
          if(error instanceof BadInput) {
            alert('Bad data!');
            // this.form.setErrors(error.originalError));
          } else {
            alert('An unexpected error occurred!');
            console.log(error);
          }
        });
    
    this.posts.unshift(post);
  }

  updatePost(post) {
    this.service.updatePost(post, {isRead: true})
      .subscribe(response => {
        console.log(response.json());
      }, error => {
        alert('An unexpected error occurred!');
        console.log(error);
      });
    // this.http.put(this.url, JSON.stringify(post));
  }

  deletePost(post) {
    this.service.deletePost(345)
      .subscribe(
        response => {
          let index = this.posts.indexOf(post);
          this.posts.splice(index, 1);
        }, 
        (error: AppError) => {  
          if(error instanceof NotFoundError) {
            alert('This post has been already deleted!');
          } else {
            alert('An unexpected error occurred!');
          }
        });
  }

}
