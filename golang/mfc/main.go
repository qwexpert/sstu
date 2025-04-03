package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Client struct {
	id int
}

func main() {
	rand.Seed(time.Now().UnixNano())

	var wg sync.WaitGroup

	clientQueue := make(chan Client, 100) 
	done 		:= make(chan struct{})           

	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for {
				select {
					case client, ok := <-clientQueue:
						if !ok {
							return 
						}

						fmt.Println("\033[32mОкно", id, "занято клиентом ", client.id, "\033[0m")

						serviceTime := time.Duration(rand.Intn(5000)+500) * time.Millisecond
						time.Sleep(serviceTime)
						fmt.Printf("Клиент с номером %d обслужен (%.2fs)\n", client.id, serviceTime.Seconds())
					case <-done:
						return
				}
			}
		}(i)
	}

	go func() {
		clientID := 1
		startTime := time.Now()

		for time.Since(startTime) < 60 * time.Second {
			arrivalTime := time.Duration(rand.Intn(5000)+500) * time.Millisecond

			fmt.Println("\033[31mКлиент", clientID, "в ожидании", "\033[0m")
			time.Sleep(arrivalTime)

			clientQueue <- Client{id: clientID}
			clientID++
		}

		close(clientQueue) 
	}()

	wg.Wait()
	close(done) 
}