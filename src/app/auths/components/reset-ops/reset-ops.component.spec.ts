import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetOpsComponent } from './reset-ops.component';

describe('ResetOpsComponent', () => {
  let component: ResetOpsComponent;
  let fixture: ComponentFixture<ResetOpsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetOpsComponent]
    });
    fixture = TestBed.createComponent(ResetOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
