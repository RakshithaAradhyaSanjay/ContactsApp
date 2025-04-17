import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    Name: new FormControl<string>(''),
    Email: new FormControl<string | null>(null),
    Phone: new FormControl<string>(''),
    Favourite: new FormControl<boolean>(false)
  })
  contacts$ = this.getContacts();

  onFormSubmit() {
    console.log("entered");
    const addContactRequest = [{
      Name: this.contactsForm.value.Name,
      Email: this.contactsForm.value.Email,
      Phone: this.contactsForm.value.Phone,
      Favourite: this.contactsForm.value.Favourite,
    }];
    this.http.post('https://localhost:7185/api/Contacts',addContactRequest)
    .subscribe({
      next: (value) => {
        console.log(value);
        this.contacts$ = this.getContacts();
        this.contactsForm.reset();
      },
      error : (err) => {
        console.error('Error response:' , err);
        console.error('Validation errors',err.error.errors.$);
        console.error('Reques errors',err.error.errors.request);
      }
    });
    console.log(this.contactsForm.value)
  }



  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7185/api/Contacts')
  }
}
