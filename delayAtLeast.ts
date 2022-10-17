import { Observable } from 'rxjs';

// If target arg is equal to === the ommited value, it will not be ommited to the observer until 
// at least ms have passed since the last emission. Useful for making loading bars or 
// spinners take a minimum amount of time.
export function delayAtLeast(target: any, ms: number) {
   let lastEmissionTime = (new Date()).getTime();

   return function <T>(source$: Observable<T>): Observable<T> {
      return new Observable(subscriber => {
         return source$.subscribe({
            next(value) {

               const now = (new Date()).getTime();

               const timeSinceLastEmission = now - lastEmissionTime;

               if (value === target && now - lastEmissionTime < ms) {

                  setTimeout(() => {
                     subscriber.next(value);
                  }, ms - timeSinceLastEmission);

               } else {
                  subscriber.next(value);

               }

               lastEmissionTime = (new Date()).getTime();

            },
            error(error) {
               subscriber.error(error);
            },
            complete() {
               subscriber.complete();
            },
         });
      });
   };
}
